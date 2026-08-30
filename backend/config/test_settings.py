"""Isolated test settings; the application database remains Supabase Postgres."""

import os


os.environ.setdefault(
    "SUPABASE_DATABASE_URL",
    "postgresql://test:test@localhost:5432/test",
)

from .settings import *  # noqa: E402,F403


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}
