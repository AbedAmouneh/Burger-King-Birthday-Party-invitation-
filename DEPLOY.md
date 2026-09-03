# Deploying Double Crown to Vercel

## 1. Create the Supabase table

Open your Supabase project, go to **SQL Editor**, paste all of
[`supabase/schema.sql`](supabase/schema.sql) and run it. It is idempotent, so
running it twice is harmless.

## 2. Local development

```bash
cp env.example .env.local
```

Fill in:

| Key | Where |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → Data API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API keys → `anon` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API keys → `service_role` |
| `ADMIN_PASSPHRASE` | any phrase you choose; it gates the `#royal` admin view |
| `NEXT_PUBLIC_SITE_URL` | leave blank |

Then:

```bash
npm run dev
```

## 3. Push to a Git remote

The repo has no remote yet. Create an empty repository on GitHub, then:

```bash
git remote add origin git@github.com:<you>/double-crown.git
```

```bash
git push -u origin main
```

## 4. Import into Vercel

At [vercel.com/new](https://vercel.com/new), import the repository. Vercel
detects Next.js on its own, so leave the build settings alone.

## 5. Add the environment variables

In **Project Settings → Environment Variables**, add all four for
**Production** and **Preview**:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ADMIN_PASSPHRASE
```

This repository is public, so never commit the passphrase or either Supabase
key. They belong in `.env.local` locally and in Vercel's environment variables
in production, nowhere else.

`SUPABASE_SERVICE_ROLE_KEY` and `ADMIN_PASSPHRASE` are server-only. Do not
prefix either with `NEXT_PUBLIC_`, or they will be bundled into the JavaScript
every guest downloads.

Leave `NEXT_PUBLIC_SITE_URL` unset: the share card resolves its own absolute
URL from Vercel's `VERCEL_PROJECT_PRODUCTION_URL`. Set it only if you attach a
custom domain, to that domain's full origin (`https://...`).

## 6. Deploy, then check the share card

Deploy, then paste the URL into a WhatsApp chat with yourself. You should see
the Double Crown card with the date and venue. If the image is missing, the
usual cause is `metadataBase` resolving wrongly: set `NEXT_PUBLIC_SITE_URL` to
the deployed origin and redeploy.

WhatsApp caches previews hard. To force a refresh, add `?v=2` to the link.

## Verifying a change before you ship it

```bash
npm run verify
```

Runs `tsc`, ESLint and a production build into `.next-verify`, so it never
disturbs a running `npm run dev`.

## Re-processing the photos

Only needed if the source images in `assets/photos/` change:

```bash
./scripts/process-photos.sh
```

Needs ImageMagick, `cwebp` and Swift (macOS only, for the Vision matting).
