# Marknadsportalen

Intern supportsida där kollegor kan skicka uppdrag till marknadsavdelningen. MVP:t är byggt med Next.js App Router, TypeScript, Tailwind CSS och Supabase för auth, databas och filuppladdning.

## Kom igång lokalt

1. Installera paket:

```bash
npm install
```

2. Skapa `.env.local` från exemplet:

```bash
cp .env.local.example .env.local
```

3. Fyll i Supabase-värden:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

4. Kör SQL i Supabase SQL Editor:

```bash
supabase/schema.sql
```

Valfritt: kör även `supabase/seed.sql` för exempelärenden.

5. Starta utvecklingsservern:

```bash
npm run dev
```

Appen körs normalt på `http://localhost:3000`.

## Supabase

Schemafilen skapar:

- `profiles`
- `tickets`
- `comments`
- `files`
- `status_history`
- Storage bucket `ticket-files`
- RLS-policies för beställare och admin
- Triggers för profiler, ärendenummer, `updated_at` och statushistorik

Nya konton får rollen `beställare`. Sätt admin manuellt i Supabase:

```sql
update public.profiles
set role = 'admin'
where email = 'admin@example.com';
```

## Funktioner

- Startsida med snabbvägar till nytt uppdrag och mina uppdrag
- Login och registrering via Supabase Auth
- Skapa uppdrag med komplett brief och filuppladdning
- Mina uppdrag med status, ETA, deadline och senaste kommentar
- Admin-dashboard med filter
- Ärendesida med brief, filer, kommentarer, statushistorik och progress
- Admin kan ändra status, sätta ETA, skriva interna anteckningar, kommentera och ladda upp leveransfiler
- Beställare kan kommentera, ladda upp kompletteringar och godkänna leverans

## Deployment till Vercel

1. Pusha repot till GitHub.
2. Importera projektet i Vercel.
3. Lägg in samma miljövariabler i Vercel Project Settings.
4. Deploya.

## Projektstruktur

```text
app/                 Next.js App Router-sidor och server actions
components/          Återanvändbara UI- och dashboard-komponenter
lib/supabase/        Browser-, server- och admin-klienter för Supabase
lib/                 Typer, konstanter och helpers
supabase/            SQL-schema och seed-data
```
