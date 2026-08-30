"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Phone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function PhoneAuthPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState("");
  const [sent, setSent] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!seconds) return;
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [seconds]);

  async function sendOtp() {
    setError(null);
    if (!/^\d{10}$/.test(phone.replace(/\s/g, ""))) { setError("Enter a valid 10-digit Indian phone number."); return; }
    setBusy(true);
    try {
      const { error: authError } = await getSupabaseBrowserClient().auth.signInWithOtp({ phone: `+91${phone.replace(/\s/g, "")}` });
      if (authError) throw authError;
      setSent(true); setSeconds(45);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "OTP could not be sent."); }
    finally { setBusy(false); }
  }

  async function verifyOtp() {
    setError(null); setBusy(true);
    try {
      const { error: authError } = await getSupabaseBrowserClient().auth.verifyOtp({ phone: `+91${phone.replace(/\s/g, "")}`, token, type: "sms" });
      if (authError) throw authError;
      router.replace("/onboarding");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Invalid or expired code. Request a new OTP."); }
    finally { setBusy(false); }
  }

  return <main className="min-h-screen bg-background px-4 py-10 text-foreground"><div className="mx-auto max-w-md">
    <Link href="/auth/login" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-2 hover:text-foreground"><ArrowLeft className="h-4 w-4"/>Back to sign in</Link>
    <section className="rounded-2xl border border-border-strong bg-surface p-7 shadow-2xl">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald/30 bg-emerald/10 text-emerald"><Phone className="h-5 w-5"/></span>
      <h1 className="mt-5 font-display text-2xl font-semibold">Continue with phone</h1>
      <p className="mt-2 text-sm leading-6 text-muted-2">We’ll send a one-time verification code. StockLens never stores OTPs.</p>
      {!sent ? <div className="mt-6 space-y-4"><label className="block text-sm font-medium">Mobile number<div className="mt-2 flex"><span className="inline-flex items-center rounded-l-lg border border-r-0 border-border-strong bg-surface-2 px-3 text-sm text-muted-2">+91</span><Input value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))} inputMode="numeric" placeholder="98765 43210" className="rounded-l-none" /></div></label><Button className="w-full" onClick={sendOtp} disabled={busy}>{busy ? "Sending…" : "Send OTP"}</Button></div> : <div className="mt-6 space-y-4"><label className="block text-sm font-medium">Enter verification code<Input value={token} onChange={(event) => setToken(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" placeholder="••••••" className="mt-2 text-center text-lg tracking-[0.5em]" /></label><Button className="w-full" onClick={verifyOtp} disabled={busy || token.length !== 6}>{busy ? "Verifying…" : "Verify & Continue"}</Button><div className="flex justify-between text-sm"><button onClick={() => { setSent(false); setToken(""); }} className="text-muted-2 hover:text-foreground">Change number</button><button onClick={sendOtp} disabled={seconds > 0 || busy} className="text-emerald disabled:text-muted">{seconds ? `Resend in ${seconds}s` : "Resend OTP"}</button></div></div>}
      {error && <p role="alert" className="mt-4 rounded-lg border border-red/20 bg-red/10 px-3 py-2 text-sm text-red-300">{error}</p>}
      <p className="mt-6 flex gap-2 border-t border-border-subtle pt-5 text-xs leading-5 text-muted-2"><ShieldCheck className="h-4 w-4 shrink-0 text-emerald"/>Phone authentication is provided by Supabase Auth.</p>
    </section>
  </div></main>;
}
