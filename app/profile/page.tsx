"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Landmark,
  LogOut,
  PiggyBank,
  ShieldCheck,
  Target,
  TrendingUp,
  UserRound,
  WalletCards,
} from "lucide-react";
import { useAuth, type StockLensProfile } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/sidebar/sidebar";
import { api } from "@/lib/api";

type ProfileForm = Pick<
  StockLensProfile,
  | "display_name"
  | "bio"
  | "experience_level"
  | "risk_tolerance"
  | "investment_horizon"
  | "preferred_market"
  | "investment_goal"
  | "existing_investments"
> & {
  interests: string;
  investment_amount: string;
  monthly_contribution: string;
};

const emptyForm: ProfileForm = {
  display_name: "",
  bio: "",
  experience_level: "BEGINNER",
  risk_tolerance: "MODERATE",
  investment_horizon: "LONG_TERM",
  preferred_market: "India",
  interests: "",
  investment_amount: "",
  monthly_contribution: "",
  investment_goal: "",
  existing_investments: "",
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.055, delayChildren: 0.08 },
  },
};

const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};

const selectClass =
  "h-11 w-full rounded-lg border border-border-strong bg-surface-2 px-3 text-sm text-foreground outline-none transition-colors hover:border-white/25 focus:border-emerald/60 focus:ring-1 focus:ring-emerald";

const textareaClass =
  "w-full resize-none rounded-lg border border-border-strong bg-surface-2 px-3 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted hover:border-white/25 focus:border-emerald/60 focus:ring-1 focus:ring-emerald";

function profileToForm(profile: StockLensProfile): ProfileForm {
  return {
    display_name: profile.display_name,
    bio: profile.bio,
    experience_level: profile.experience_level,
    risk_tolerance: profile.risk_tolerance,
    investment_horizon: profile.investment_horizon,
    preferred_market: profile.preferred_market,
    interests: profile.interests.join(", "),
    investment_amount: profile.investment_amount ?? "",
    monthly_contribution: profile.monthly_contribution ?? "",
    investment_goal: profile.investment_goal,
    existing_investments: profile.existing_investments,
  };
}

function formatAmount(value: string | null | undefined): string {
  if (!value) return "Not set";
  const amount = Number(value);
  if (!Number.isFinite(amount)) return value;
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(amount);
}

export default function ProfilePage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { session, profile, loading, error: authError, refreshProfile, signOut } = useAuth();
  const [formState, setFormState] = useState<{ profileId: number | null; form: ProfileForm }>({
    profileId: null,
    form: emptyForm,
  });
  if (profile && profile.id !== formState.profileId) {
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
          investment_amount: form.investment_amount || null,
          monthly_contribution: form.monthly_contribution || null,
          investment_goal: form.investment_goal.trim(),
          existing_investments: form.existing_investments.trim(),
          interests: form.interests
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          onboarding_completed: true,
        },
        { headers: { Authorization: `Bearer ${session.access_token}` } },
      );
      await refreshProfile();
      setMessage("Your investment profile has been updated.");
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
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-muted-2">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.span
            className="h-2.5 w-2.5 rounded-full bg-emerald"
            animate={reduceMotion ? undefined : { scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          Loading your profile…
        </motion.div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="max-w-md rounded-2xl border border-border-strong bg-surface-1 p-8 text-center shadow-2xl shadow-black/20"
        >
          <UserRound className="mx-auto mb-4 h-8 w-8 text-emerald" />
          <h1 className="font-display text-2xl font-semibold">Sign in to create your profile</h1>
          <p className="mt-2 text-sm text-muted-2">Your preferences personalize research depth, risk context, and market focus.</p>
          <Button className="mt-6" asChild><Link href="/auth/login">Continue to sign in</Link></Button>
        </motion.div>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 md:ml-80">
        <main className="relative min-h-screen overflow-hidden text-foreground px-4 py-8">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-emerald/8 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, -28, 0], y: [0, 18, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-cyan/5 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, 24, 0], y: [0, -16, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex flex-wrap items-center justify-between gap-4"
        >
          <Link href="/" className="flex items-center gap-2 font-display font-semibold">
            <motion.span whileHover={{ rotate: -8, scale: 1.05 }} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-strong bg-surface-2">
              <ScanSearch className="h-4 w-4" />
            </motion.span>
            StockLens
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" asChild><Link href="/"><ArrowLeft className="h-4 w-4" />Home</Link></Button>
            <Button variant="secondary" onClick={handleSignOut}><LogOut className="h-4 w-4" />Sign out</Button>
          </div>
        </motion.header>

        <div className="grid items-start gap-6 lg:grid-cols-[300px_1fr]">
          <motion.aside
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            whileHover={reduceMotion ? undefined : { y: -3 }}
            className="h-fit overflow-hidden rounded-2xl border border-border-strong bg-surface-1/95 shadow-2xl shadow-black/15 backdrop-blur"
          >
            <div className="relative p-6">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald/60 to-transparent" />
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald/20 bg-emerald/10 text-xl font-semibold text-emerald shadow-lg shadow-emerald/5">
                {(profile?.display_name || profile?.email || "S").slice(0, 2).toUpperCase()}
              </div>
              <h1 className="mt-4 font-display text-xl font-semibold">{profile?.display_name || "Your StockLens profile"}</h1>
              <p className="mt-1 break-all text-sm text-muted-2">{profile?.email}</p>
              <div className="mt-5 space-y-3 border-t border-border-subtle pt-5 text-sm">
                <ProfileRow label="Experience" value={profile?.experience_level.toLowerCase() || "Beginner"} />
                <ProfileRow label="Horizon" value={(profile?.investment_horizon || "LONG_TERM").replace("_", " ").toLowerCase()} />
                <ProfileRow label="Status" value={profile?.onboarding_completed ? "Personalized" : "Setup needed"} accent />
              </div>
            </div>
            <div className="grid grid-cols-2 border-t border-border-subtle bg-white/[0.015]">
              <SnapshotStat icon={<WalletCards />} label="Invested" value={formatAmount(profile?.investment_amount)} />
              <SnapshotStat icon={<TrendingUp />} label="Monthly" value={formatAmount(profile?.monthly_contribution)} border />
            </div>
          </motion.aside>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-border-strong bg-surface-1/95 p-6 shadow-2xl shadow-black/15 backdrop-blur sm:p-8"
          >
            <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald">Personalized intelligence</p>
                <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">Build your investor profile</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-2">Give StockLens the context it needs to frame research around your capital, goals, and comfort with risk.</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald/20 bg-emerald/8 px-3 py-1.5 text-xs text-emerald">
                <ShieldCheck className="h-3.5 w-3.5" /> Private profile data
              </span>
            </div>

            <motion.form variants={containerVariants} initial="hidden" animate="visible" onSubmit={saveProfile} className="space-y-8">
              <FormSection icon={<UserRound />} eyebrow="About you" title="Research preferences">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Display name"><Input className="transition-colors hover:border-white/25 focus-visible:border-emerald/60" value={form.display_name} onChange={(event) => setForm({ ...form, display_name: event.target.value })} maxLength={120} placeholder="How should we address you?" /></Field>
                  <Field label="Preferred market"><Input className="transition-colors hover:border-white/25 focus-visible:border-emerald/60" value={form.preferred_market} onChange={(event) => setForm({ ...form, preferred_market: event.target.value })} maxLength={80} placeholder="India, US, Global…" /></Field>
                  <Field label="Investing experience">
                    <select className={selectClass} value={form.experience_level} onChange={(event) => setForm({ ...form, experience_level: event.target.value as ProfileForm["experience_level"] })}>
                      <option value="BEGINNER">Beginner — explain every concept</option>
                      <option value="INTERMEDIATE">Intermediate — balanced depth</option>
                      <option value="ADVANCED">Advanced — dense research detail</option>
                    </select>
                  </Field>
                  <Field label="Research interests"><Input className="transition-colors hover:border-white/25 focus-visible:border-emerald/60" value={form.interests} onChange={(event) => setForm({ ...form, interests: event.target.value })} placeholder="Technology, dividends, momentum" /></Field>
                </div>
              </FormSection>

              <FormSection icon={<Landmark />} eyebrow="Financial snapshot" title="Investment profile" highlighted>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Investment amount" hint="Use your preferred currency.">
                    <IconInput icon={<WalletCards />} type="number" min="0" step="0.01" inputMode="decimal" value={form.investment_amount} onChange={(value) => setForm({ ...form, investment_amount: value })} placeholder="500000" />
                  </Field>
                  <Field label="Monthly contribution" hint="Your planned recurring investment.">
                    <IconInput icon={<PiggyBank />} type="number" min="0" step="0.01" inputMode="decimal" value={form.monthly_contribution} onChange={(value) => setForm({ ...form, monthly_contribution: value })} placeholder="25000" />
                  </Field>
                  <Field label="Time horizon">
                    <div className="relative">
                      <CalendarClock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald" />
                      <select className={`${selectClass} pl-10`} value={form.investment_horizon} onChange={(event) => setForm({ ...form, investment_horizon: event.target.value as ProfileForm["investment_horizon"] })}>
                        <option value="SHORT_TERM">Short term — up to 3 years</option>
                        <option value="MEDIUM_TERM">Medium term — 3 to 7 years</option>
                        <option value="LONG_TERM">Long term — 7+ years</option>
                      </select>
                    </div>
                  </Field>
                  <Field label="Risk tolerance">
                    <div className="relative">
                      <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald" />
                      <select className={`${selectClass} pl-10`} value={form.risk_tolerance} onChange={(event) => setForm({ ...form, risk_tolerance: event.target.value as ProfileForm["risk_tolerance"] })}>
                        <option value="CONSERVATIVE">Conservative — protect capital</option>
                        <option value="MODERATE">Moderate — balanced growth</option>
                        <option value="AGGRESSIVE">Aggressive — maximize growth</option>
                      </select>
                    </div>
                  </Field>
                  <Field label="Investment goal" className="sm:col-span-2" hint="Describe the outcome you are investing toward.">
                    <div className="relative">
                      <Target className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-emerald" />
                      <textarea className={`${textareaClass} pl-10`} value={form.investment_goal} onChange={(event) => setForm({ ...form, investment_goal: event.target.value })} maxLength={300} rows={3} placeholder="Build a retirement corpus, buy a home, fund education…" />
                    </div>
                  </Field>
                  <Field label="Existing investments" className="sm:col-span-2" hint="A short summary is enough—never enter account numbers or passwords.">
                    <textarea className={textareaClass} value={form.existing_investments} onChange={(event) => setForm({ ...form, existing_investments: event.target.value })} maxLength={500} rows={3} placeholder="Index funds, direct equities, fixed deposits, retirement accounts…" />
                  </Field>
                </div>
              </FormSection>

              <FormSection icon={<Target />} eyebrow="Optional context" title="Anything else StockLens should know?">
                <Field label="About your investing approach">
                  <textarea className={textareaClass} value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} maxLength={500} rows={4} placeholder="Preferences, constraints, or context for your research experience…" />
                </Field>
              </FormSection>

              <AnimatePresence mode="wait">
                {(error || authError) && (
                  <motion.p key="error" role="alert" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                    {error || authError}
                  </motion.p>
                )}
                {message && (
                  <motion.p key="success" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 rounded-lg border border-emerald/20 bg-emerald/10 px-3 py-2 text-sm text-emerald">
                    <CheckCircle2 className="h-4 w-4" />{message}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.div variants={fieldVariants} className="flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-6">
                <p className="max-w-md text-xs leading-5 text-muted">Profile details personalize presentation and risk context. They do not guarantee returns or replace professional advice.</p>
                <motion.div whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
                  <Button type="submit" size="lg" disabled={saving || !profile}>
                    {saving ? "Saving…" : "Save investment profile"}
                  </Button>
                </motion.div>
              </motion.div>
            </motion.form>
          </motion.section>
        </div>
      </div>
        </main>
      </div>
    </div>
  );
}

function FormSection({ icon, eyebrow, title, highlighted = false, children }: { icon: ReactNode; eyebrow: string; title: string; highlighted?: boolean; children: ReactNode }) {
  return (
    <motion.section variants={fieldVariants} className={highlighted ? "relative overflow-hidden rounded-2xl border border-emerald/20 bg-emerald/[0.035] p-5 sm:p-6" : "rounded-2xl border border-border-subtle bg-black/10 p-5 sm:p-6"}>
      {highlighted && <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-emerald/8 blur-3xl" />}
      <div className="relative mb-5 flex items-center gap-3">
        <motion.span whileHover={{ rotate: -6, scale: 1.06 }} className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald/20 bg-emerald/10 text-emerald [&>svg]:h-4 [&>svg]:w-4">{icon}</motion.span>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-emerald">{eyebrow}</p>
          <h3 className="mt-0.5 font-display text-lg font-semibold">{title}</h3>
        </div>
      </div>
      <div className="relative">{children}</div>
    </motion.section>
  );
}

function Field({ label, hint, className = "", children }: { label: string; hint?: string; className?: string; children: ReactNode }) {
  return (
    <motion.label variants={fieldVariants} className={`group block space-y-2 ${className}`}>
      <span className="flex items-end justify-between gap-3">
        <span className="text-sm font-medium transition-colors group-focus-within:text-emerald">{label}</span>
        {hint && <span className="text-right text-[10px] leading-4 text-muted">{hint}</span>}
      </span>
      {children}
    </motion.label>
  );
}

function IconInput({ icon, value, onChange, ...props }: { icon: ReactNode; value: string; onChange: (value: string) => void } & Omit<React.ComponentProps<typeof Input>, "value" | "onChange">) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-emerald [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      <Input {...props} value={value} onChange={(event) => onChange(event.target.value)} className="pl-10 font-mono-tab transition-colors hover:border-white/25 focus-visible:border-emerald/60" />
    </div>
  );
}

function ProfileRow({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return <div className="flex justify-between gap-3"><span className="text-muted-2">{label}</span><span className={`capitalize ${accent ? "text-emerald" : ""}`}>{value}</span></div>;
}

function SnapshotStat({ icon, label, value, border = false }: { icon: ReactNode; label: string; value: string; border?: boolean }) {
  return (
    <motion.div whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.05)" }} className={`p-4 ${border ? "border-l border-border-subtle" : ""}`}>
      <span className="text-emerald [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-1 truncate font-mono-tab text-sm font-medium">{value}</p>
    </motion.div>
  );
}
