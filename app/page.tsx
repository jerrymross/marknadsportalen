import { ArrowRight, ClipboardList } from "lucide-react";
import { ButtonLink } from "@/components/ui";

export default function HomePage() {
  return (
    <section className="grid min-h-[70vh] items-center gap-10 lg:grid-cols-[1fr_420px]">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
          Intern marknadssupport
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Skicka uppdrag till marknadsavdelningen
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Samla brief, filer, kommentarer, status och ETA i ett tydligt flöde från
          beställning till godkänd leverans.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/new">Skapa nytt uppdrag</ButtonLink>
          <ButtonLink href="/tickets" variant="secondary">
            Se mina uppdrag
          </ButtonLink>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex size-12 items-center justify-center rounded-md bg-brand-50 text-brand-700">
          <ClipboardList size={24} />
        </div>
        <h2 className="mt-5 text-xl font-semibold text-slate-950">
          Ett enklare inflöde för marknad
        </h2>
        <div className="mt-5 grid gap-4 text-sm text-slate-600">
          {[
            "Briefar med tydliga fält och filuppladdning",
            "Status, deadline och ETA synligt för alla parter",
            "Adminvy för prioritering, kommentarer och leverans"
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <ArrowRight className="text-brand-600" size={16} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
