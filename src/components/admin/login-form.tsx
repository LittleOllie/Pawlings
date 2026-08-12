"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export function LoginForm({ configError = false }: { configError?: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        const msg = authError.message.toLowerCase();
        if (msg.includes("email not confirmed")) {
          setError(
            "Your email is not confirmed yet. In Supabase, recreate the user with Auto Confirm enabled, or confirm the email in Authentication → Users."
          );
        } else if (msg.includes("invalid login credentials")) {
          setError(
            "Wrong email or password. Double-check both match exactly what you created in Supabase → Authentication → Users."
          );
        } else {
          setError(authError.message);
        }
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto glow-accent">
      <CardHeader>
        <CardTitle>Admin Sign In</CardTitle>
        <p className="text-sm text-foreground-muted">
          Sign in with your admin credentials.
        </p>
      </CardHeader>
      <CardContent>
        {configError && (
          <p
            className="mb-4 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-sm text-warning"
            role="alert"
          >
            Supabase is not configured on this deployment. In Vercel, go to
            Project → Settings → Environment Variables and add{" "}
            <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
            <code className="text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and{" "}
            <code className="text-xs">SUPABASE_SERVICE_ROLE_KEY</code>, then
            redeploy.
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <p className="text-sm text-error" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" loading={loading}>
            Sign in
          </Button>
        </form>
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground transition-colors"
          >
            ← Back to Website
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
