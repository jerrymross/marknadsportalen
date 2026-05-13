import { statuses, type TicketStatus } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function ProgressBar({ status }: { status: TicketStatus }) {
  const index = Math.max(0, statuses.indexOf(status));
  const percent = ((index + 1) / statuses.length) * 100;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-950">Progress</span>
        <span className="text-slate-600">{status}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-brand-600 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500 sm:grid-cols-3 lg:grid-cols-5">
        {statuses.map((item, itemIndex) => (
          <span
            key={item}
            className={cn(itemIndex <= index && "font-semibold text-brand-700")}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
