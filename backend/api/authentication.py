import json
import os
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request as UrlRequest
from urllib.request import urlopen
from uuid import UUID

from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import exceptions
from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework.request import Request

from .models import UserProfile


def _auth_configuration() -> tuple[str, str]:
    supabase_url = os.environ.get("SUPABASE_URL", "").rstrip("/")
    publishable_key = os.environ.get("SUPABASE_PUBLISHABLE_KEY", "")
    if not supabase_url or not publishable_key:
        raise exceptions.AuthenticationFailed(
            "Supabase authentication is not configured on the backend."
        )
    if not supabase_url.startswith("https://"):
        raise exceptions.AuthenticationFailed("SUPABASE_URL must use HTTPS.")
    return supabase_url, publishable_key


def _fetch_supabase_user(token: str) -> dict[str, Any]:
    """Validate a Supabase access token against the authoritative Auth server."""
    supabase_url, publishable_key = _auth_configuration()
    request = UrlRequest(
        f"{supabase_url}/auth/v1/user",
        headers={
            "apikey": publishable_key,
            "Authorization": f"Bearer {token}",
            "Accept": "application/json",
        },
        method="GET",
    )
    try:
        with urlopen(request, timeout=8) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        if exc.code in {401, 403}:
            raise exceptions.AuthenticationFailed("Invalid or expired access token.") from exc
        raise exceptions.AuthenticationFailed("Supabase Auth rejected the request.") from exc
    except (URLError, TimeoutError, json.JSONDecodeError) as exc:
        raise exceptions.AuthenticationFailed("Supabase Auth is temporarily unavailable.") from exc

    if not isinstance(payload, dict) or not payload.get("id"):
        raise exceptions.AuthenticationFailed("Supabase returned an invalid user response.")
    return payload


@transaction.atomic
def _provision_user(identity: dict[str, Any]):
    try:
        supabase_user_id = UUID(str(identity["id"]))
    except (KeyError, TypeError, ValueError) as exc:
        raise exceptions.AuthenticationFailed("Supabase user ID is invalid.") from exc

    email = str(identity.get("email") or "")[:254]
    phone = str(identity.get("phone") or "")[:32]
    metadata = identity.get("user_metadata") or {}
    app_metadata = identity.get("app_metadata") or {}
    if not isinstance(metadata, dict):
        metadata = {}
    if not isinstance(app_metadata, dict):
        app_metadata = {}

    existing_profile = UserProfile.objects.select_related("user").filter(
        supabase_user_id=supabase_user_id
    ).first()
    if existing_profile:
        user = existing_profile.user
        user_updates: list[str] = []
        if email and user.email != email:
            user.email = email
            user_updates.append("email")
        if user_updates:
            user.save(update_fields=user_updates)
        profile_updates: list[str] = []
        if phone and existing_profile.phone_number != phone:
            existing_profile.phone_number = phone
            profile_updates.append("phone_number")
        provider = str(app_metadata.get("provider") or "")[:40]
        if provider and existing_profile.auth_provider != provider:
            existing_profile.auth_provider = provider
            profile_updates.append("auth_provider")
        if profile_updates:
            existing_profile.save(update_fields=[*profile_updates, "updated_at"])
        return user

    user_model = get_user_model()
    user = user_model(username=f"supabase_{supabase_user_id.hex}", email=email)
    user.set_unusable_password()
    user.save()

    display_name = str(
        metadata.get("full_name") or metadata.get("name") or email.split("@")[0] or ""
    )[:120]
    avatar_url = str(metadata.get("avatar_url") or metadata.get("picture") or "")[:1000]
    UserProfile.objects.create(
        user=user,
        supabase_user_id=supabase_user_id,
        display_name=display_name,
        phone_number=phone,
        avatar_url=avatar_url,
        auth_provider=str(app_metadata.get("provider") or "")[:40],
    )
    return user


class SupabaseAuthentication(BaseAuthentication):
    keyword = b"bearer"

    def authenticate(self, request: Request):
        authorization = get_authorization_header(request).split()
        if not authorization:
            return None
        if authorization[0].lower() != self.keyword:
            return None
        if len(authorization) != 2:
            raise exceptions.AuthenticationFailed("Invalid Authorization header.")

        try:
            token = authorization[1].decode("utf-8")
        except UnicodeDecodeError as exc:
            raise exceptions.AuthenticationFailed("Invalid access token encoding.") from exc

        identity = _fetch_supabase_user(token)
        return _provision_user(identity), identity

    def authenticate_header(self, request: Request) -> str:
        return "Bearer"
