import Link from "next/link";
import { CalendarDays, Clock3, MessageSquare } from "lucide-react";
import { StatusBadge, PriorityBadge } from "@/components/badges";
import type { Ticket } from "@/lib/types";
import { formatDate, formatDateTime } from "@/lib/utils";

export function TicketCard({
  ticket,
  latestComment
}: {
  ticket: Ticket;
  latestComment?: string | null;
}) {
  return (
    <Link
      href={`/tickets/${ticket.id}`}
      className="block rounded-lg border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-brand-100"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
            {ticket.ticket_number}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-950">{ticket.title}</h2>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>
      <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
        <span className="flex items-center gap-2">
          <CalendarDays size={16} /> Deadline {formatDate(ticket.deadline)}
        </span>
        <span className="flex items-center gap-2">
          <Clock3 size={16} /> ETA {formatDate(ticket.eta)}
        </span>
        <span className="flex items-center gap-2">
          <MessageSquare size={16} /> Uppdaterad {formatDateTime(ticket.updated_at)}
        </span>
      </div>
      {latestComment ? (
        <p className="mt-4 line-clamp-2 rounded-md bg-slate-50 p-3 text-sm text-slate-600">
          {latestComment}
        </p>
      ) : null}
    </Link>
  );
}
