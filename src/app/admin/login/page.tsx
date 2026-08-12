import { LoginForm } from "@/components/admin/login-form";
import { projectConfig } from "@/config/project";

export const metadata = {
  title: "Admin Sign In",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-widest text-foreground-subtle">
          {projectConfig.shortName} Admin
        </p>
        <h1 className="font-display text-3xl text-foreground mt-2">
          Welcome back
        </h1>
      </div>
      <LoginForm configError={params.error === "config"} />
    </div>
  );
}
