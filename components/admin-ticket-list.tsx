"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { adminFilters } from "@/lib/constants";
import type { Ticket } from "@/lib/types";
import { formatDate, formatDateTime } from "@/lib/utils";
import { PriorityBadge, StatusBadge } from "@/components/badges";

function matchesFilter(ticket: Ticket, filter: string) {
  if (filter === "Alla") return true;
  if (filter === "Nya") return ["Inskickat", "Mottaget"].includes(ticket.status);
  if (filter === "Pågående") return ["Planerat", "Pågår"].includes(ticket.status);
  if (filter === "Väntar på info") return ticket.status === "Behöver mer information";
  if (filter === "Korrektur") return ticket.status === "Korrektur";
  if (filter === "Klara") return ["Klart", "Avslutat"].includes(ticket.status);
  if (filter === "Akuta") return ticket.priority === "akut";
  return true;
}

export function AdminTicketList({ tickets }: { tickets: Ticket[] }) {
  const [filter, setFilter] = useState("Alla");
  const filteredTickets = useMemo(
    () => tickets.filter((ticket) => matchesFilter(ticket, filter)),
    [filter, tickets]
  );

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap gap-2">
        {adminFilters.map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`rounded-md px-3 py-2 text-sm font-medium transition ${
              filter === item
                ? "bg-brand-600 text-white"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
        <div className="hidden grid-cols-[120px_1.5fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase text-slate-500 lg:grid">
          <span>Ärende</span>
          <span>Titel</span>
          <span>Beställare</span>
          <span>Typ</span>
          <span>Status</span>
          <span>Prioritet</span>
          <span>Deadline/ETA</span>
          <span>Uppdaterad</span>
        </div>
        {filteredTickets.map((ticket) => (
          <Link
            key={ticket.id}
            href={`/tickets/${ticket.id}`}
            className="grid gap-3 border-b border-slate-100 px-4 py-4 text-sm transition last:border-0 hover:bg-slate-50 lg:grid-cols-[120px_1.5fr_1fr_1fr_1fr_1fr_1fr_1fr] lg:items-center"
          >
            <span className="font-semibold text-brand-700">{ticket.ticket_number}</span>
            <span className="font-medium text-slate-950">{ticket.title}</span>
            <span className="text-slate-600">{ticket.requester_name}</span>
            <span className="text-slate-600">{ticket.category}</span>
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
            <span className="text-slate-600">
              {formatDate(ticket.deadline)} / {formatDate(ticket.eta)}
            </span>
            <span className="text-slate-600">{formatDateTime(ticket.updated_at)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
