import os
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlparse

from django.core.exceptions import ImproperlyConfigured
from django.core.management.utils import get_random_secret_key
from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

# Production deployments must set DJANGO_SECRET_KEY. The generated fallback is
# intentionally process-local and suitable only for local development.
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY") or get_random_secret_key()
DEBUG = os.environ.get("DJANGO_DEBUG", "true").lower() in {"1", "true", "yes"}
ALLOWED_HOSTS = [
    host.strip()
    for host in os.environ.get("DJANGO_ALLOWED_HOSTS", "127.0.0.1,localhost").split(",")
    if host.strip()
]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "api",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

def _supabase_database_config() -> dict:
    database_url = os.environ.get("SUPABASE_DATABASE_URL") or os.environ.get("DATABASE_URL")
    if not database_url:
        raise ImproperlyConfigured(
            "Set SUPABASE_DATABASE_URL to the Postgres connection string from "
            "Supabase Dashboard > Connect."
        )

    placeholder_tokens = ("project_ref", "your_password", "region.pooler.supabase.com")
    if any(token in database_url.lower() for token in placeholder_tokens):
        raise ImproperlyConfigured(
            "SUPABASE_DATABASE_URL contains example placeholders. Copy the complete, "
            "project-specific connection string from Supabase Dashboard > Connect; "
            "do not use PROJECT_REF, YOUR_PASSWORD, or REGION literally."
        )

    try:
        parsed = urlparse(database_url)
        port = parsed.port or 5432
    except ValueError as exc:
        raise ImproperlyConfigured(
            "SUPABASE_DATABASE_URL is not a valid PostgreSQL URI. Remove literal "
            "square brackets and replace every placeholder with its real value. "
            "Expected: postgresql://USER:PASSWORD@HOST:5432/postgres"
        ) from exc

    if parsed.scheme not in {"postgres", "postgresql"}:
        raise ImproperlyConfigured("SUPABASE_DATABASE_URL must be a PostgreSQL URL.")
    if not parsed.hostname or not parsed.username or not parsed.path.lstrip("/"):
        raise ImproperlyConfigured("SUPABASE_DATABASE_URL is missing connection details.")

    query = parse_qs(parsed.query)
    options: dict[str, object] = {
        "sslmode": query.get("sslmode", ["require"])[-1],
    }
    if "sslrootcert" in query:
        options["sslrootcert"] = query["sslrootcert"][-1]

    # Supabase transaction-pooler endpoints use port 6543 and do not support
    # prepared statements or server-side cursors.
    transaction_pooler = port == 6543
    if transaction_pooler:
        options["prepare_threshold"] = None

    return {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": unquote(parsed.path.lstrip("/")),
        "USER": unquote(parsed.username),
        "PASSWORD": unquote(parsed.password or ""),
        "HOST": parsed.hostname,
        "PORT": port,
        "OPTIONS": options,
        "CONN_MAX_AGE": 0
        if transaction_pooler
        else int(os.environ.get("DATABASE_CONN_MAX_AGE", "60")),
        "CONN_HEALTH_CHECKS": True,
        "DISABLE_SERVER_SIDE_CURSORS": transaction_pooler,
    }


DATABASES = {"default": _supabase_database_config()}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.environ.get(
        "CORS_ALLOWED_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000",
    ).split(",")
    if origin.strip()
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "api.authentication.SupabaseAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
}
