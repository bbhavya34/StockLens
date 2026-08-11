"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, KeyRound, ScanSearch, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updatePassword(event: FormEvent) {
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
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!sessionData.session) {
        throw new Error("This password link is invalid or has expired. Request a new link from the login page.");
      }

      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      await supabase.auth.signOut();
      router.replace("/auth/login?password=updated");
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Could not update your password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 py-10 text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.12),transparent_40%)]" />
      <div className="relative mx-auto max-w-md">
        <Link href="/auth/login" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-2 hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to login
        </Link>

        <section className="rounded-2xl border border-border-strong bg-surface-1/90 p-6 shadow-2xl backdrop-blur sm:p-8">
          <div className="mb-7 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald/30 bg-emerald/10">
              <ScanSearch className="h-5 w-5 text-emerald" />
            </span>
            <div>
              <p className="font-display text-xl font-semibold">Choose a new password</p>
              <p className="text-sm text-muted-2">Secure your StockLens account</p>
            </div>
          </div>

          <form onSubmit={updatePassword} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium" htmlFor="password">New password</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3.5 h-4 w-4 text-muted" />
                <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium" htmlFor="confirm-password">Confirm new password</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3.5 h-4 w-4 text-muted" />
                <Input id="confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={8} className="pl-10" required />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Updating password…" : "Update password"}
            </Button>
          </form>

          {error && <p role="alert" className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

          <div className="mt-6 flex items-start gap-2 border-t border-border-subtle pt-5 text-xs leading-5 text-muted-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
            Password links expire and can only be used by someone with access to your email.
          </div>
        </section>
      </div>
    </main>
  );
}
