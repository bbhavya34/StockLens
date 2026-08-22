"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, LoaderCircle } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function completeSignIn() {
      try {
        const parameters = new URLSearchParams(window.location.search);
        const providerError = parameters.get("error_description") || parameters.get("error");
        if (providerError) throw new Error(providerError);

        const supabase = getSupabaseBrowserClient();
        const code = parameters.get("code");
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session) {
          throw new Error(
            "Supabase did not return a session. Start a new sign-in and verify the redirect allow list.",
          );
        }

        router.replace("/onboarding");
      } catch (callbackError) {
        if (!active) return;
        setError(
          callbackError instanceof Error
            ? callbackError.message
            : "The authentication session was not returned.",
        );
      }
    }

    void completeSignIn();
    return () => {
      active = false;
    };
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="max-w-md rounded-2xl border border-border-strong bg-surface-1 p-8 text-center">
        {!error ? (
          <>
            <LoaderCircle className="mx-auto mb-4 h-7 w-7 animate-spin text-emerald" />
            <h1 className="font-display text-xl font-semibold">Securing your session</h1>
            <p className="mt-2 text-sm text-muted-2">Completing Google sign-in and preparing your StockLens profile…</p>
          </>
        ) : (
          <>
            <AlertTriangle className="mx-auto mb-4 h-7 w-7 text-amber" />
            <h1 className="font-display text-xl font-semibold">Sign-in needs attention</h1>
            <p className="mt-2 text-sm text-muted-2">{error}</p>
            <p className="mt-3 text-xs leading-5 text-muted">If this repeats, confirm Google is enabled in Supabase and this exact URL is in its redirect allow list: {typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : "/auth/callback"}</p>
            <Link href="/auth/login" className="mt-5 inline-block text-sm text-emerald hover:underline">Try sign-in again</Link>
          </>
        )}
      </div>
    </main>
  );
}
