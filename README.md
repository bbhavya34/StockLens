# StockLens — Explainable AI Market Intelligence

StockLens is an explainable stock-research and portfolio-analysis MVP. The existing
Next.js App Router frontend is paired with a Django REST Framework backend in `backend/`.

The frontend currently contains local demo market data. The backend never fabricates
prices, indicators, fundamentals, news, sentiment, or AI confidence scores; provider-backed
endpoints return a structured `*_provider_not_configured` error until integrations exist.

## Stack

- Next.js 16, React 19, TypeScript, Tailwind CSS, Zustand, Recharts, Framer Motion
- Django, Django REST Framework, django-cors-headers, Supabase Postgres

## Development setup (Windows PowerShell)

Create the project-root virtual environment only if `.venv/` does not already exist:

```powershell
python -m venv .venv
```

Backend:

```powershell
.\.venv\Scripts\Activate.ps1
cd backend
pip install -r requirements.txt
# Replace placeholders in backend/.env with the exact Supabase values.
python manage.py migrate
python manage.py runserver
```

The value must be the complete project-specific URI—not the literal `PROJECT_REF`,
`YOUR_PASSWORD`, or `REGION` placeholders. Copy it from **Supabase Dashboard > Connect**. Use a direct
connection for migrations and persistent backends when IPv6 is available; use the session
pooler on port `5432` for a persistent backend on IPv4-only networks. Transaction pooling
on port `6543` is also supported by the settings, which automatically disables prepared
statements and server-side cursors. Never commit the real URL or database password.

Frontend (from the project root, in another terminal):

```powershell
Copy-Item .env.local.example .env.local
npm install
npm run dev
```

Development URLs:

- Next.js: http://localhost:3000
- Django: http://127.0.0.1:8000
- Health check: http://127.0.0.1:8000/api/health/

## API configuration

The frontend API helper in `lib/api.ts` reads `NEXT_PUBLIC_API_BASE_URL`. Do not hardcode
the backend origin in components. Django permits `http://localhost:3000` through CORS by
default; override `CORS_ALLOWED_ORIGINS` with a comma-separated list when needed.

Email/password authentication and personalized profiles use Supabase Auth. Follow the
complete dashboard setup in [`docs/authentication.md`](docs/authentication.md), then open
`http://localhost:3000/auth/signup` for a new account or `/auth/login` to sign in.

Optional Django environment variables:

- `SUPABASE_DATABASE_URL` — required Supabase Postgres connection URL (`DATABASE_URL` also works)
- `SUPABASE_URL` — Supabase project URL used by Django token validation
- `SUPABASE_PUBLISHABLE_KEY` — public project key used by Django token validation
- `DJANGO_SECRET_KEY` — required for stable production deployments
- `DJANGO_DEBUG` — defaults to `true` for local development
- `DJANGO_ALLOWED_HOSTS` — comma-separated, defaults to `127.0.0.1,localhost`
- `CORS_ALLOWED_ORIGINS` — comma-separated, defaults to `http://localhost:3000`

## Authentication status

Supabase bearer authentication and Django admin sessions are enabled. Public stock reads
and anonymous explainable analysis requests are allowed, but portfolios,
watchlists, and alerts require authentication. Their querysets are always restricted to
the current owner. Private analysis reports are only visible to their owner; reports made
without a user are public.

The Next.js flow uses separate email/password sign-up and login pages. Django validates the
Supabase access token before provisioning a local user and owner-only research profile on
the first login. Email delivery, production redirect domains, password rules, rate limits,
and CAPTCHA must be configured in your Supabase project.

## Verification

Backend:

```powershell
cd backend
# Ensure backend/.env contains the exact Supabase values.
..\.venv\Scripts\python.exe manage.py check
..\.venv\Scripts\python.exe manage.py test --settings=config.test_settings
```

Frontend (project root):

```powershell
npm run lint
npx tsc --noEmit
npm run build
```

Quick browser or PowerShell checks while Django is running:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/health/
Invoke-RestMethod http://127.0.0.1:8000/api/stocks/
```

An empty stock list is expected until real symbols are added. No seed data is inserted.

## Integrations still required

- Real-time and historical market-data provider
- Fundamentals provider
- News and sentiment provider
- Technical-indicator and risk calculations over provider data
- Evidence-grounded AI/LLM synthesis for explainable research reports
- Production Google OAuth branding, SMS provider, CAPTCHA, and account-linking policy

StockLens is a research platform, not a guarantee of returns or financial advice.
