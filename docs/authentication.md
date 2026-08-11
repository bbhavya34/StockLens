# StockLens authentication setup

StockLens uses Supabase Auth for email/password identity and Django REST Framework for
authorization. New users create an account on the dedicated sign-up page and are redirected
to the login page. On their first authenticated API request, Django validates the access token
with Supabase and provisions a local user and private StockLens profile. Passwords, refresh
tokens, and provider tokens are not stored by Django.

## 1. Copy the Supabase public Auth configuration

In **Supabase Dashboard > Project Settings > API** copy:

- Project URL
- Publishable key (the legacy `anon` key also works, but prefer the publishable key)

Put both values in the root `.env.local`:

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_REPLACE_ME
```

The generated `backend/.env` is loaded automatically by Django. Replace its placeholders:

```dotenv
SUPABASE_DATABASE_URL=postgresql://YOUR_REAL_CONNECTION_URI
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_REPLACE_ME
```

These are separate from `SUPABASE_DATABASE_URL`. Never expose the database password,
service-role key, or Supabase secret key through a `NEXT_PUBLIC_` variable.

## 2. Configure email/password authentication

1. Open **Supabase Dashboard > Authentication > Providers > Email**.
2. Enable the email provider and allow new user sign-ups.
3. Choose whether email confirmation is required. When enabled, users must confirm their
   address before their first login.
4. Configure password strength and Auth rate limits for production.

## 3. Configure redirect URLs

In **Supabase Dashboard > Authentication > URL Configuration** set:

- Site URL: `http://localhost:3000`
- Additional redirect URL: `http://localhost:3000/auth/login`
- Additional redirect URL: `http://localhost:3000/auth/reset-password`

Add the equivalent HTTPS production URL before deployment.

## 4. Run Django

```powershell
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## 5. Run Next.js

```powershell
Copy-Item .env.local.example .env.local
# Replace all placeholders in .env.local, then:
npm run dev
```

Open `http://localhost:3000/auth/signup` to create a new account or
`http://localhost:3000/auth/login` to sign in. After signing in, StockLens calls
`GET /api/profile/` with the Supabase access token and creates the Django profile safely.

## Production checklist

- Use HTTPS for the frontend, Django API, and authentication redirects.
- Keep Django's `DJANGO_SECRET_KEY` and database URL in a server-side secret manager.
- Never put the Supabase service-role key in frontend code.
- Configure password strength, leaked-password protection, CAPTCHA, and Auth rate limits.
- Add monitoring for failed authentication and token validation.
- Configure production email delivery and confirmation templates if confirmation is enabled.
