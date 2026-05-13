import { Upload } from "lucide-react";
import { createTicket } from "@/app/actions/tickets";
import { categories, priorities } from "@/lib/constants";
import type { Profile } from "@/lib/types";
import { Field, inputClass } from "@/components/ui";

export function TicketForm({
  profile,
  email
}: {
  profile: Profile | null;
  email: string;
}) {
  return (
    <form action={createTicket} className="grid gap-6">
      <div className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-soft md:grid-cols-2">
        <Field label="Titel på uppdrag" required>
          <input className={inputClass} name="title" required />
        </Field>
        <Field label="Beställare" required>
          <input
            className={inputClass}
            name="requester_name"
            defaultValue={profile?.name ?? ""}
            required
          />
        </Field>
        <Field label="E-post" required>
          <input
            className={inputClass}
            name="requester_email"
            type="email"
            defaultValue={email}
            required
          />
        </Field>
        <Field label="Avdelning/skola" required>
          <input
            className={inputClass}
            name="department"
            defaultValue={profile?.department ?? ""}
            required
          />
        </Field>
        <Field label="Typ av uppdrag" required>
          <select className={inputClass} name="category" required defaultValue="">
            <option value="" disabled>
              Välj typ
            </option>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </Field>
        <Field label="Önskad deadline">
          <input className={inputClass} name="deadline" type="date" />
        </Field>
        <Field label="Prioritet" required>
          <select className={inputClass} name="priority" defaultValue="normal">
            {priorities.map((priority) => (
              <option key={priority}>{priority}</option>
            ))}
          </select>
        </Field>
        <Field label="Var ska materialet användas?">
          <input className={inputClass} name="usage_channel" />
        </Field>
      </div>

      <div className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <Field label="Beskrivning" required>
          <textarea className={inputClass} name="description" rows={5} required />
        </Field>
        <Field label="Syfte/mål">
          <textarea className={inputClass} name="goal" rows={3} />
        </Field>
        <Field label="Målgrupp">
          <textarea className={inputClass} name="target_audience" rows={3} />
        </Field>
        <Field label="Extra kommentarer">
          <textarea className={inputClass} name="extra_comments" rows={3} />
        </Field>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          <span>Ladda upp filer</span>
          <span className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-600 hover:border-brand-300">
            <Upload className="mb-2 text-brand-600" size={22} />
            Välj filer som hör till briefen
            <input className="sr-only" name="files" type="file" multiple />
          </span>
        </label>
      </div>

      <div className="flex justify-end">
        <button className="rounded-md bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700">
          Skicka uppdrag
        </button>
      </div>
    </form>
  );
}
