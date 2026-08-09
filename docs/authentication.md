# StockLens authentication setup

StockLens uses Supabase Auth for identity and Django REST Framework for authorization.
Supported sign-in methods are Google OAuth and phone-number OTP. On the first authenticated
API request, Django validates the access token with Supabase and provisions a local user and
private StockLens profile. Google passwords, SMS codes, refresh tokens, and provider tokens
are not stored by Django.

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

## 2. Configure redirect URLs

In **Supabase Dashboard > Authentication > URL Configuration** set:

- Site URL: `http://localhost:3000`
- Additional redirect URL: `http://localhost:3000/auth/callback`

Add the equivalent HTTPS production URL before deployment.

## 3. Enable Google

1. Open **Supabase Dashboard > Authentication > Providers > Google**.
2. Copy the Supabase callback URL shown there.
3. In Google Cloud Console, configure the OAuth consent screen.
4. Create an OAuth 2.0 Client ID with application type **Web application**.
5. Add `http://localhost:3000` as an authorized JavaScript origin.
6. Add the Supabase callback URL as an authorized redirect URI. It normally resembles
   `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`.
7. Copy the Google Client ID and Client Secret into the Supabase Google provider settings,
   enable the provider, and save.

Only request the standard `openid`, email, and profile scopes unless StockLens genuinely
needs additional Google APIs.

## 4. Enable phone OTP

1. Open **Supabase Dashboard > Authentication > Providers > Phone**.
2. Enable phone authentication.
3. Configure a supported SMS provider such as Twilio, MessageBird, or Vonage.
4. Set conservative Auth rate limits and enable CAPTCHA before production.
5. For Indian recipients, confirm the SMS provider's TRAI/DLT registration and template
   requirements before launch.

Users must enter numbers in E.164 format, for example `+919876543210`.

## 5. Run Django

```powershell
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## 6. Run Next.js

```powershell
Copy-Item .env.local.example .env.local
# Replace all placeholders in .env.local, then:
npm run dev
```

Open `http://localhost:3000/auth`. After signing in, StockLens calls
`GET /api/profile/` with the Supabase access token and creates the Django profile safely.

## Production checklist

- Use HTTPS for the frontend, Django API, and OAuth redirects.
- Keep Django's `DJANGO_SECRET_KEY` and database URL in a server-side secret manager.
- Never put the Supabase service-role key in frontend code.
- Configure Google consent-screen branding and production domains.
- Configure CAPTCHA and rate limits for SMS abuse/cost protection.
- Add monitoring for failed Auth validation and SMS delivery.
- Decide and document account-linking behavior when one person uses both Google and phone.
