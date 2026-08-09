"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, LogOut, ScanSearch, UserRound } from "lucide-react";
import { useAuth, type StockLensProfile } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

type ProfileForm = Pick<
  StockLensProfile,
  | "display_name"
  | "bio"
  | "experience_level"
  | "risk_tolerance"
  | "investment_horizon"
  | "preferred_market"
> & { interests: string };

const emptyForm: ProfileForm = {
  display_name: "",
  bio: "",
  experience_level: "BEGINNER",
  risk_tolerance: "MODERATE",
  investment_horizon: "LONG_TERM",
  preferred_market: "India",
  interests: "",
};

function profileToForm(profile: StockLensProfile): ProfileForm {
  return {
    display_name: profile.display_name,
    bio: profile.bio,
    experience_level: profile.experience_level,
    risk_tolerance: profile.risk_tolerance,
    investment_horizon: profile.investment_horizon,
    preferred_market: profile.preferred_market,
    interests: profile.interests.join(", "),
  };
}

const selectClass =
  "h-11 w-full rounded-lg border border-border-strong bg-surface-2 px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-emerald";

export default function ProfilePage() {
  const router = useRouter();
  const { session, profile, loading, error: authError, refreshProfile, signOut } = useAuth();
  const [formState, setFormState] = useState<{ profileId: number | null; form: ProfileForm }>({
    profileId: null,
    form: emptyForm,
  });
  if (profile && formState.profileId !== profile.id) {
    setFormState({ profileId: profile.id, form: profileToForm(profile) });
  }
  const form = formState.form;
  const setForm = (nextForm: ProfileForm) => {
    setFormState((current) => ({ ...current, form: nextForm }));
  };
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    if (!session) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await api.patch<StockLensProfile>(
        "/profile/",
        {
          ...form,
          display_name: form.display_name.trim(),
          bio: form.bio.trim(),
          preferred_market: form.preferred_market.trim(),
          interests: form.interests.split(",").map((item) => item.trim()).filter(Boolean),
          onboarding_completed: true,
        },
        { headers: { Authorization: `Bearer ${session.access_token}` } },
      );
      await refreshProfile();
      setMessage("Your research experience has been personalized.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not save your profile.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    router.replace("/");
  }

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-background text-muted-2">Loading your profile…</main>;
  }

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <div className="max-w-md rounded-2xl border border-border-strong bg-surface-1 p-8 text-center">
          <UserRound className="mx-auto mb-4 h-8 w-8 text-emerald" />
          <h1 className="font-display text-2xl font-semibold">Sign in to create your profile</h1>
          <p className="mt-2 text-sm text-muted-2">Your preferences personalize research depth, risk context, and market focus.</p>
          <Button className="mt-6" asChild><Link href="/auth">Continue to sign in</Link></Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-display font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-strong bg-surface-2"><ScanSearch className="h-4 w-4" /></span>
            StockLens
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" asChild><Link href="/"><ArrowLeft className="h-4 w-4" />Home</Link></Button>
            <Button variant="secondary" onClick={handleSignOut}><LogOut className="h-4 w-4" />Sign out</Button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-2xl border border-border-strong bg-surface-1 p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald/10 text-xl font-semibold text-emerald">
              {(profile?.display_name || profile?.email || "S").slice(0, 2).toUpperCase()}
            </div>
            <h1 className="mt-4 font-display text-xl font-semibold">{profile?.display_name || "Your StockLens profile"}</h1>
            <p className="mt-1 break-all text-sm text-muted-2">{profile?.email || profile?.phone_number}</p>
            <div className="mt-5 space-y-3 border-t border-border-subtle pt-5 text-sm">
              <div className="flex justify-between gap-3"><span className="text-muted-2">Provider</span><span className="capitalize">{profile?.auth_provider || "Supabase"}</span></div>
              <div className="flex justify-between gap-3"><span className="text-muted-2">Experience</span><span className="capitalize">{profile?.experience_level.toLowerCase()}</span></div>
              <div className="flex justify-between gap-3"><span className="text-muted-2">Status</span><span className="text-emerald">{profile?.onboarding_completed ? "Personalized" : "Setup needed"}</span></div>
            </div>
          </aside>

          <section className="rounded-2xl border border-border-strong bg-surface-1 p-6 sm:p-8">
            <div className="mb-7">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald">Research preferences</p>
              <h2 className="mt-2 font-display text-2xl font-semibold">Shape your StockLens experience</h2>
              <p className="mt-2 text-sm text-muted-2">These settings guide presentation and context. They never generate guaranteed-return claims.</p>
            </div>

            <form onSubmit={saveProfile} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Display name"><Input value={form.display_name} onChange={(event) => setForm({ ...form, display_name: event.target.value })} maxLength={120} placeholder="How should we address you?" /></Field>
                <Field label="Preferred market"><Input value={form.preferred_market} onChange={(event) => setForm({ ...form, preferred_market: event.target.value })} maxLength={80} placeholder="India, US, Global…" /></Field>
                <Field label="Investing experience">
                  <select className={selectClass} value={form.experience_level} onChange={(event) => setForm({ ...form, experience_level: event.target.value as ProfileForm["experience_level"] })}>
                    <option value="BEGINNER">Beginner — explain every concept</option><option value="INTERMEDIATE">Intermediate — balanced depth</option><option value="ADVANCED">Advanced — dense research detail</option>
                  </select>
                </Field>
                <Field label="Risk tolerance">
                  <select className={selectClass} value={form.risk_tolerance} onChange={(event) => setForm({ ...form, risk_tolerance: event.target.value as ProfileForm["risk_tolerance"] })}>
                    <option value="CONSERVATIVE">Conservative</option><option value="MODERATE">Moderate</option><option value="AGGRESSIVE">Aggressive</option>
                  </select>
                </Field>
                <Field label="Investment horizon">
                  <select className={selectClass} value={form.investment_horizon} onChange={(event) => setForm({ ...form, investment_horizon: event.target.value as ProfileForm["investment_horizon"] })}>
                    <option value="SHORT_TERM">Short term</option><option value="MEDIUM_TERM">Medium term</option><option value="LONG_TERM">Long term</option>
                  </select>
                </Field>
                <Field label="Research interests"><Input value={form.interests} onChange={(event) => setForm({ ...form, interests: event.target.value })} placeholder="Technology, dividends, momentum" /></Field>
              </div>
              <Field label="About your investing goals">
                <textarea value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} maxLength={500} rows={4} placeholder="Optional context for your research experience…" className="w-full resize-none rounded-lg border border-border-strong bg-surface-2 px-3 py-3 text-sm outline-none placeholder:text-muted focus:ring-1 focus:ring-emerald" />
              </Field>
              {(error || authError) && <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error || authError}</p>}
              {message && <p className="flex items-center gap-2 rounded-lg border border-emerald/20 bg-emerald/10 px-3 py-2 text-sm text-emerald"><CheckCircle2 className="h-4 w-4" />{message}</p>}
              <Button type="submit" disabled={saving || !profile}>{saving ? "Saving…" : "Save personalized profile"}</Button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block space-y-2"><span className="text-sm font-medium">{label}</span>{children}</label>;
}
