import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

function loginErrorRedirect(origin: string, message: string) {
  const url = new URL("/auth/login", origin);
  url.searchParams.set("error", message);
  return url;
}

function safeDestination(origin: string, requestedPath: string | null) {
  if (!requestedPath?.startsWith("/") || requestedPath.startsWith("//")) {
    return new URL("/onboarding", origin);
  }
  return new URL(requestedPath, origin);
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const providerError =
    requestUrl.searchParams.get("error_description") ??
    requestUrl.searchParams.get("error");

  if (providerError) {
    return NextResponse.redirect(loginErrorRedirect(requestUrl.origin, providerError));
  }

  const code = requestUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(
      loginErrorRedirect(requestUrl.origin, "The authentication callback did not include a code."),
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !publishableKey) {
    return NextResponse.redirect(
      loginErrorRedirect(requestUrl.origin, "Supabase Auth is not configured."),
    );
  }

  const destination = safeDestination(
    requestUrl.origin,
    requestUrl.searchParams.get("next"),
  );
  const response = NextResponse.redirect(destination);
  const supabase = createServerClient(supabaseUrl, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headersToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
        Object.entries(headersToSet).forEach(([name, value]) => {
          response.headers.set(name, value);
        });
      },
    },
  });

  const flowId = requestUrl.searchParams.get("sb_flow_id");
  const { error } = await supabase.auth.exchangeCodeForSession(
    code,
    flowId ? { flowId } : undefined,
  );

  if (error) {
    response.headers.set(
      "Location",
      loginErrorRedirect(requestUrl.origin, error.message).toString(),
    );
  }

  return response;
}
