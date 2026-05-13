import { signIn, signUp } from "@/app/actions/auth";
import { Field, inputClass } from "@/components/ui";

export function LoginForm({
  error,
  next
}: {
  error?: string;
  next?: string;
}) {
  return (
    <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
      <form action={signIn} className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-semibold text-slate-950">Logga in</h1>
        <p className="mt-2 text-sm text-slate-600">
          Använd ditt konto för att skapa och följa upp uppdrag.
        </p>
        {error ? (
          <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>
        ) : null}
        <input type="hidden" name="next" value={next ?? "/tickets"} />
        <div className="mt-6 grid gap-4">
          <Field label="E-post" required>
            <input className={inputClass} name="email" type="email" required />
          </Field>
          <Field label="Lösenord" required>
            <input className={inputClass} name="password" type="password" required />
          </Field>
        </div>
        <button className="mt-6 w-full rounded-md bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700">
          Logga in
        </button>
      </form>

      <form action={signUp} className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-semibold text-slate-950">Skapa konto</h2>
        <p className="mt-2 text-sm text-slate-600">
          Nya konton får rollen beställare. Admin sätts i Supabase-profilen.
        </p>
        <div className="mt-6 grid gap-4">
          <Field label="Namn" required>
            <input className={inputClass} name="name" required />
          </Field>
          <Field label="Avdelning/skola">
            <input className={inputClass} name="department" />
          </Field>
          <Field label="E-post" required>
            <input className={inputClass} name="email" type="email" required />
          </Field>
          <Field label="Lösenord" required>
            <input className={inputClass} name="password" type="password" minLength={6} required />
          </Field>
        </div>
        <button className="mt-6 w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50">
          Registrera
        </button>
      </form>
    </div>
  );
}
