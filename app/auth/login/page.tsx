"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, KeyRound, Mail, ScanSearch, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState<string | null>(() => {
    if (searchParams.get("signup") === "success") {
      return "Account created successfully. Confirm your email if required, then sign in.";
    }
    if (searchParams.get("password") === "updated") {
      return "Password updated successfully. Sign in with your new password.";
    }
    return null;
  });
  const [error, setError] = useState<string | null>(() => searchParams.get("error"));

  async function signInWithGoogle() {
    setError(null);
    setMessage(null);
    setBusy(true);
    try {
      const { error: oauthError } = await getSupabaseBrowserClient().auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (oauthError) throw oauthError;
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Google sign-in failed.");
      setBusy(false);
    }
  }

  async function login(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setBusy(true);

    try {
      const { error: loginError } = await getSupabaseBrowserClient().auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (loginError) throw loginError;
      router.replace("/onboarding");
    } catch (authError) {
      const authMessage = authError instanceof Error ? authError.message : "Could not sign in.";
      setError(
        authMessage.toLowerCase().includes("invalid login credentials")
          ? "Email or password is incorrect. If you used the previous login method, select ‘Set or reset password’ below."
          : authMessage,
      );
    } finally {
      setBusy(false);
    }
  }

  async function resetPassword() {
    setError(null);
    setMessage(null);
    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setError("Enter your email address first.");
      return;
    }

    setResetting(true);
    try {
      const { error: resetError } = await getSupabaseBrowserClient().auth.resetPasswordForEmail(
        normalizedEmail,
        { redirectTo: `${window.location.origin}/auth/reset-password` },
      );
      if (resetError) throw resetError;
      setMessage("Password setup link sent. Check your email and open the link to choose a password.");
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Could not send the password setup link.");
    } finally {
      setResetting(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 py-10 text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.12),transparent_40%)]" />
      <div className="relative mx-auto max-w-md">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-2 hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to StockLens
        </Link>

        <section className="rounded-2xl border border-border-strong bg-surface-1/90 p-6 shadow-2xl backdrop-blur sm:p-8">
          <div className="mb-7 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald/30 bg-emerald/10">
              <ScanSearch className="h-5 w-5 text-emerald" />
            </span>
            <div>
              <p className="font-display text-xl font-semibold">Welcome back</p>
              <p className="text-sm text-muted-2">Sign in to continue to StockLens</p>
            </div>
          </div>

          <Button type="button" className="h-11 w-full" variant="secondary" onClick={signInWithGoogle} disabled={busy || resetting}>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-neutral-900">G</span>
            {busy ? "Connecting…" : "Continue with Google"}
          </Button>

          <Button type="button" className="mt-3 h-11 w-full" variant="outline" asChild>
            <Link href="/auth/phone">Continue with phone</Link>
          </Button>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted">
            <span className="h-px flex-1 bg-border-subtle" /> or use email <span className="h-px flex-1 bg-border-subtle" />
          </div>

          <form onSubmit={login} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium" htmlFor="email">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted" />
                <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium" htmlFor="password">Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3.5 h-4 w-4 text-muted" />
                <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" className="pl-10" required />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={busy || resetting}>
              {busy ? "Signing in…" : "Sign in"}
            </Button>
            <button
              type="button"
              onClick={resetPassword}
              disabled={busy || resetting}
              className="w-full text-sm text-muted-2 transition-colors hover:text-emerald disabled:opacity-50"
            >
              {resetting ? "Sending password link…" : "Set or reset password"}
            </button>
          </form>

          {message && <p className="mt-4 rounded-lg border border-emerald/20 bg-emerald/10 px-3 py-2 text-sm text-emerald">{message}</p>}
          {error && <p role="alert" className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

          <p className="mt-6 text-center text-sm text-muted-2">
            New to StockLens? <Link href="/auth/signup" className="font-medium text-emerald hover:underline">Create an account</Link>
          </p>
          <div className="mt-6 flex items-start gap-2 border-t border-border-subtle pt-5 text-xs leading-5 text-muted-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
            Your credentials are securely handled by Supabase and are never stored by StockLens.
          </div>
        </section>
      </div>
    </main>
  );
}
