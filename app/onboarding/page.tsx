"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, ScanSearch } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const steps = ["Experience", "Risk", "Horizon", "Markets", "Watchlist", "Portfolio"];
const choices = [["BEGINNER", "INTERMEDIATE", "ADVANCED", "PROFESSIONAL"], ["CONSERVATIVE", "MODERATE", "AGGRESSIVE"], ["SHORT_TERM", "MEDIUM_TERM", "LONG_TERM"], ["India", "US", "Global"], ["RELIANCE", "TCS", "INFY", "HDFCBANK", "NIFTY 50"], ["Skip for now", "I’ll add holdings later"]];

export default function OnboardingPage() {
  const router = useRouter(); const { session, loading } = useAuth(); const [step, setStep] = useState(0); const [selected, setSelected] = useState<string[]>([]); const [answers, setAnswers] = useState<string[][]>(Array.from({ length: steps.length }, () => [])); const [saving, setSaving] = useState(false);
  useEffect(() => { if (!loading && !session) router.replace("/auth/login"); }, [loading, router, session]);
  if (loading || !session) return null;
  const multi = step === 4;
  const choose = (value: string) => setSelected(multi ? (selected.includes(value) ? selected.filter((x) => x !== value) : [...selected, value]) : [value]);
  async function next() { if (!selected.length && step !== 5) return; const nextAnswers = answers.map((answer, index) => index === step ? selected : answer); if (step < steps.length - 1) { setAnswers(nextAnswers); setStep(step + 1); setSelected([]); return; } setSaving(true); try { await api.patch("/profile/", { experience_level: nextAnswers[0][0] === "PROFESSIONAL" ? "ADVANCED" : (nextAnswers[0][0] || "BEGINNER"), risk_tolerance: nextAnswers[1][0] || "MODERATE", investment_horizon: nextAnswers[2][0] || "LONG_TERM", preferred_market: nextAnswers[3][0] || "India", interests: nextAnswers[4], onboarding_completed: true }, { headers: { Authorization: `Bearer ${session?.access_token}` } }); } finally { router.replace("/research"); } }
  return <main className="min-h-screen bg-background px-4 py-8 text-foreground"><div className="mx-auto max-w-3xl"><header className="mb-12 flex items-center justify-between"><div className="flex items-center gap-2 font-display font-semibold"><ScanSearch className="h-5 w-5 text-emerald"/>StockLens</div><span className="text-sm text-muted-2">Step {step + 1} of {steps.length}</span></header><div className="mb-8 flex gap-1.5">{steps.map((_, index) => <span key={index} className={`h-1 flex-1 rounded-full ${index <= step ? "bg-emerald" : "bg-surface-2"}`}/>)}</div><section className="rounded-2xl border border-border-strong bg-surface p-7 sm:p-10"><p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald">Personalize intelligence</p><h1 className="mt-3 font-display text-3xl font-semibold">{step === 5 ? "Your StockLens workspace is ready" : `Choose your ${steps[step].toLowerCase()}`}</h1><p className="mt-3 text-muted-2">{step === 5 ? "You can add portfolio details any time. Your research dashboard is ready." : "This only shapes how research is presented. It is not financial advice."}</p>{step < 5 && <div className="mt-8 grid gap-3 sm:grid-cols-2">{choices[step].map((value) => <button key={value} onClick={() => choose(value)} className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${selected.includes(value) ? "border-emerald bg-emerald/10" : "border-border-strong bg-surface-2 hover:border-emerald/50"}`}><span>{value.replaceAll("_", " ")}</span>{selected.includes(value) && <Check className="h-4 w-4 text-emerald"/>}</button>)}</div>}<div className="mt-10 flex justify-end"><Button onClick={next} disabled={saving || (!selected.length && step !== 5)}>{saving ? "Preparing workspace…" : step === 5 ? "Open research" : "Continue"}<ChevronRight className="h-4 w-4"/></Button></div></section></div></main>;
}
