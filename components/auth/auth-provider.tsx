"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { api } from "@/lib/api";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export type StockLensProfile = {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  experience_level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  risk_tolerance: "CONSERVATIVE" | "MODERATE" | "AGGRESSIVE";
  investment_horizon: "SHORT_TERM" | "MEDIUM_TERM" | "LONG_TERM";
  preferred_market: string;
  interests: string[];
  auth_provider: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
};

type AuthContextValue = {
  session: Session | null;
  profile: StockLensProfile | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [configuration] = useState<{
    client: SupabaseClient | null;
    error: string | null;
  }>(() => {
    try {
      return { client: getSupabaseBrowserClient(), error: null };
    } catch (configurationError) {
      return {
        client: null,
        error:
          configurationError instanceof Error
            ? configurationError.message
            : "Supabase Auth is not configured.",
      };
    }
  });
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<StockLensProfile | null>(null);
  const [loading, setLoading] = useState(configuration.client !== null);
  const [error, setError] = useState<string | null>(configuration.error);

  const loadProfile = useCallback(async (activeSession: Session | null) => {
    if (!activeSession) {
      setProfile(null);
      setError(null);
      return;
    }
    try {
      const nextProfile = await api.get<StockLensProfile>("/profile/", {
        headers: { Authorization: `Bearer ${activeSession.access_token}` },
      });
      setProfile(nextProfile);
      setError(null);
    } catch (requestError) {
      setProfile(null);
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load your StockLens profile.",
      );
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const client = configuration.client;
    if (!client) return;

    void client.auth.getSession().then(({ data, error: sessionError }) => {
      if (!mounted) return;
      setSession(data.session);
      if (sessionError) setError(sessionError.message);
      void loadProfile(data.session).finally(() => {
        if (mounted) setLoading(false);
      });
    });

    const { data: listener } = client.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      void loadProfile(nextSession);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [configuration.client, loadProfile]);

  const refreshProfile = useCallback(async () => {
    await loadProfile(session);
  }, [loadProfile, session]);

  const signOut = useCallback(async () => {
    const client = getSupabaseBrowserClient();
    const { error: signOutError } = await client.auth.signOut();
    if (signOutError) throw signOutError;
    setSession(null);
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({ session, profile, loading, error, refreshProfile, signOut }),
    [session, profile, loading, error, refreshProfile, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
