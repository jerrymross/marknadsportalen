import { LoginForm } from "@/components/login-form";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  return <LoginForm error={params.error} next={params.next} />;
}
