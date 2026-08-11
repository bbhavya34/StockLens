"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, KeyRound, Mail, ScanSearch, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signUpWithGoogle() {
    setError(null);
    setBusy(true);
    try {
      const { error: oauthError } = await getSupabaseBrowserClient().auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (oauthError) throw oauthError;
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Google sign-up failed.");
      setBusy(false);
    }
  }

  async function signup(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error: signupError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/login` },
      });
      if (signupError) throw signupError;

      if (data.user?.identities?.length === 0) {
        throw new Error(
          "An account with this email already exists. Go to login and select ‘Set or reset password’.",
        );
      }

      // Some Supabase projects sign users in immediately when email confirmation is
      // disabled. End that temporary session so every new account follows the same
      // explicit sign-up -> login flow.
      if (data.session) {
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) throw signOutError;
      }
      router.replace("/auth/login?signup=success");
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Could not create your account.");
    } finally {
      setBusy(false);
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
              <p className="font-display text-xl font-semibold">Create your account</p>
              <p className="text-sm text-muted-2">Start your personalized StockLens profile</p>
            </div>
          </div>

          <Button type="button" className="h-11 w-full" variant="secondary" onClick={signUpWithGoogle} disabled={busy}>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-neutral-900">G</span>
            {busy ? "Connecting…" : "Continue with Google"}
          </Button>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted">
            <span className="h-px flex-1 bg-border-subtle" /> or use email <span className="h-px flex-1 bg-border-subtle" />
          </div>

          <form onSubmit={signup} className="space-y-4">
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
                <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} className="pl-10" required />
              </div>
              <p className="text-xs text-muted">Use at least 8 characters.</p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium" htmlFor="confirm-password">Confirm password</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3.5 h-4 w-4 text-muted" />
                <Input id="confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={8} className="pl-10" required />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Creating account…" : "Create account"}
            </Button>
          </form>

          {error && <p role="alert" className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

          <p className="mt-6 text-center text-sm text-muted-2">
            Already have an account? <Link href="/auth/login" className="font-medium text-emerald hover:underline">Sign in</Link>
          </p>
          <div className="mt-6 flex items-start gap-2 border-t border-border-subtle pt-5 text-xs leading-5 text-muted-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
            After signing in for the first time, you’ll complete your investor details as before.
          </div>
        </section>
      </div>
    </main>
  );
}
