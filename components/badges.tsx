import { cn } from "@/lib/utils";
import type { Priority, TicketStatus } from "@/lib/constants";

const statusColors: Record<TicketStatus, string> = {
  Inskickat: "bg-slate-100 text-slate-700",
  Mottaget: "bg-blue-50 text-blue-700",
  "Behöver mer information": "bg-amber-50 text-amber-700",
  Planerat: "bg-indigo-50 text-indigo-700",
  Pågår: "bg-cyan-50 text-cyan-700",
  Korrektur: "bg-violet-50 text-violet-700",
  "Väntar på godkännande": "bg-orange-50 text-orange-700",
  Klart: "bg-emerald-50 text-emerald-700",
  Avslutat: "bg-slate-200 text-slate-800"
};

const priorityColors: Record<Priority, string> = {
  låg: "bg-slate-100 text-slate-700",
  normal: "bg-blue-50 text-blue-700",
  hög: "bg-amber-50 text-amber-700",
  akut: "bg-red-50 text-red-700"
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", statusColors[status])}>
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", priorityColors[priority])}>
      {priority}
    </span>
  );
}
