"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, KeyRound, ScanSearch, ShieldCheck, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AuthPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [busy, setBusy] = useState<"google" | "phone" | "verify" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function signInWithGoogle() {
    setBusy("google");
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (oauthError) throw oauthError;
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Google sign-in failed.");
      setBusy(null);
    }
  }

  async function sendOtp(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
      setError("Use international format, for example +919876543210.");
      return;
    }
    setBusy("phone");
    try {
      const { error: otpError } = await getSupabaseBrowserClient().auth.signInWithOtp({
        phone,
      });
      if (otpError) throw otpError;
      setOtpSent(true);
      setMessage("A 6-digit verification code was sent to your phone.");
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Could not send the code.");
    } finally {
      setBusy(null);
    }
  }

  async function verifyOtp(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit code from the SMS.");
      return;
    }
    setBusy("verify");
    try {
      const { error: verifyError } = await getSupabaseBrowserClient().auth.verifyOtp({
        phone,
        token: otp,
        type: "sms",
      });
      if (verifyError) throw verifyError;
      router.replace("/profile");
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "The code could not be verified.");
    } finally {
      setBusy(null);
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
              <p className="font-display text-xl font-semibold">Welcome to StockLens</p>
              <p className="text-sm text-muted-2">Your research profile, secured by Supabase</p>
            </div>
          </div>

          <Button className="h-11 w-full" variant="secondary" onClick={signInWithGoogle} disabled={busy !== null}>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-neutral-900">G</span>
            {busy === "google" ? "Connecting…" : "Continue with Google"}
          </Button>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted">
            <span className="h-px flex-1 bg-border-subtle" /> or use your phone <span className="h-px flex-1 bg-border-subtle" />
          </div>

          {!otpSent ? (
            <form onSubmit={sendOtp} className="space-y-4">
              <label className="block text-sm font-medium" htmlFor="phone">Mobile number</label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-3.5 h-4 w-4 text-muted" />
                <Input id="phone" value={phone} onChange={(event) => setPhone(event.target.value.trim())} placeholder="+919876543210" inputMode="tel" autoComplete="tel" className="pl-10" />
              </div>
              <Button type="submit" className="w-full" disabled={busy !== null}>
                {busy === "phone" ? "Sending code…" : "Send verification code"}
              </Button>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium" htmlFor="otp">Verification code</label>
                <p className="mt-1 text-xs text-muted-2">Sent to {phone}</p>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3.5 h-4 w-4 text-muted" />
                <Input id="otp" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" inputMode="numeric" autoComplete="one-time-code" className="pl-10 tracking-[0.45em]" />
              </div>
              <Button type="submit" className="w-full" disabled={busy !== null}>
                {busy === "verify" ? "Verifying…" : "Verify and continue"}
              </Button>
              <button type="button" onClick={() => { setOtpSent(false); setOtp(""); setMessage(null); }} className="w-full text-sm text-muted-2 hover:text-foreground">Use a different number</button>
            </form>
          )}

          {message && <p className="mt-4 rounded-lg border border-emerald/20 bg-emerald/10 px-3 py-2 text-sm text-emerald">{message}</p>}
          {error && <p role="alert" className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

          <div className="mt-6 flex items-start gap-2 text-xs leading-5 text-muted-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
            Google and SMS credentials are handled by Supabase. StockLens never stores your OAuth password or OTP.
          </div>
        </section>
      </div>
    </main>
  );
}
