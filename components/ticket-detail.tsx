import { addComment, approveDelivery, updateTicketAdmin } from "@/app/actions/tickets";
import { statuses } from "@/lib/constants";
import type { Comment, StatusHistory, Ticket, TicketFile } from "@/lib/types";
import { formatDate, formatDateTime } from "@/lib/utils";
import { Field, inputClass } from "@/components/ui";
import { PriorityBadge, StatusBadge } from "@/components/badges";
import { ProgressBar } from "@/components/progress-bar";

function Detail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm leading-6 text-slate-900">{value || "Ej angivet"}</dd>
    </div>
  );
}

export function TicketDetail({
  ticket,
  comments,
  files,
  history,
  isAdmin
}: {
  ticket: Ticket;
  comments: Comment[];
  files: TicketFile[];
  history: StatusHistory[];
  isAdmin: boolean;
}) {
  const visibleComments = isAdmin ? comments : comments.filter((comment) => !comment.is_internal);
  const addCommentAction = addComment.bind(null, ticket.id);
  const updateAction = updateTicketAdmin.bind(null, ticket.id);
  const approveAction = approveDelivery.bind(null, ticket.id);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <section className="grid gap-6">
        <ProgressBar status={ticket.status} />

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                {ticket.ticket_number}
              </p>
              <h1 className="mt-1 text-3xl font-semibold text-slate-950">{ticket.title}</h1>
            </div>
            <div className="flex gap-2">
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>
          </div>
          <dl className="mt-6 grid gap-5 md:grid-cols-2">
            <Detail label="Beställare" value={ticket.requester_name} />
            <Detail label="E-post" value={ticket.requester_email} />
            <Detail label="Avdelning/skola" value={ticket.department} />
            <Detail label="Typ" value={ticket.category} />
            <Detail label="Deadline" value={formatDate(ticket.deadline)} />
            <Detail label="ETA" value={formatDate(ticket.eta)} />
            <Detail label="Beskrivning" value={ticket.description} />
            <Detail label="Syfte/mål" value={ticket.goal} />
            <Detail label="Målgrupp" value={ticket.target_audience} />
            <Detail label="Användning" value={ticket.usage_channel} />
          </dl>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-slate-950">Kommentarer</h2>
          <div className="mt-5 grid gap-4">
            {visibleComments.length ? (
              visibleComments.map((comment) => (
                <article
                  key={comment.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-950">
                      {comment.profiles?.name ?? comment.profiles?.email ?? "Användare"}
                      {comment.is_internal ? (
                        <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                          Intern
                        </span>
                      ) : null}
                    </p>
                    <time className="text-xs text-slate-500">
                      {formatDateTime(comment.created_at)}
                    </time>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {comment.body}
                  </p>
                </article>
              ))
            ) : (
              <p className="text-sm text-slate-600">Inga kommentarer ännu.</p>
            )}
          </div>
          <form action={addCommentAction} className="mt-6 grid gap-4">
            <Field label="Skriv kommentar">
              <textarea className={inputClass} name="body" rows={4} />
            </Field>
            {isAdmin ? (
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input name="is_internal" type="checkbox" />
                Intern anteckning
              </label>
            ) : null}
            <Field label="Ladda upp kompletterande filer">
              <input className={inputClass} name="files" type="file" multiple />
            </Field>
            <button className="w-fit rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
              Skicka
            </button>
          </form>
        </div>
      </section>

      <aside className="grid content-start gap-6">
        {isAdmin ? (
          <form action={updateAction} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-slate-950">Adminhantering</h2>
            <Field label="Status">
              <select className={inputClass} name="status" defaultValue={ticket.status}>
                {statuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </Field>
            <Field label="ETA">
              <input className={inputClass} name="eta" type="date" defaultValue={ticket.eta ?? ""} />
            </Field>
            <Field label="Intern anteckning">
              <textarea className={inputClass} name="internal_note" rows={3} />
            </Field>
            <Field label="Kommentar till beställaren">
              <textarea className={inputClass} name="customer_comment" rows={3} />
            </Field>
            <Field label="Ladda upp färdiga filer">
              <input className={inputClass} name="files" type="file" multiple />
            </Field>
            <button className="rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">
              Spara uppdatering
            </button>
          </form>
        ) : ticket.status === "Väntar på godkännande" ? (
          <form action={approveAction} className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-sm font-semibold text-emerald-900">Leverans väntar på godkännande.</p>
            <button className="mt-4 rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
              Godkänn leverans
            </button>
          </form>
        ) : null}

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-slate-950">Filer</h2>
          <div className="mt-4 grid gap-2">
            {files.length ? (
              files.map((file) => (
                <a
                  key={file.id}
                  className="rounded-md border border-slate-200 px-3 py-2 text-sm text-brand-700 hover:bg-slate-50"
                  href={file.file_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {file.file_name}
                </a>
              ))
            ) : (
              <p className="text-sm text-slate-600">Inga filer uppladdade.</p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-slate-950">Statushistorik</h2>
          <div className="mt-4 grid gap-3">
            {history.length ? (
              history.map((item) => (
                <div key={item.id} className="border-l-2 border-brand-200 pl-3 text-sm">
                  <p className="font-medium text-slate-950">
                    {item.old_status ?? "Skapad"} → {item.new_status}
                  </p>
                  <p className="text-xs text-slate-500">{formatDateTime(item.created_at)}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-600">Ingen historik ännu.</p>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
