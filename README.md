# Hey Mursal

A cute mobile web app made to cheer up Mursal — soft sky blues, pink accents, personal love notes (Jonny, Mango, pasta & nature), an unlimited press-and-hold hug, and a gentle reminder: she never has to explain, you're here if she needs you.

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:4321](http://127.0.0.1:4321).

For push notifications while developing, use HTTPS:

```bash
npx next dev --experimental-https -p 4321
```

## Customize her messages

Edit `src/lib/cheer-data.ts` — add strings to the `loveNotes` array and tweak mood messages in `cheerByMood`.

## Hugs + web push

- When Mursal holds the hug button for a moment, a paper airplane with a heart trail flies off, and the hug is listed at `/sarmadaccess`.
- Rewrite her notes on that same page. She reads whatever you save.
- You send one back at [/sarmadaccess](http://127.0.0.1:4321/sarmadaccess). That can send a **web push** to her phone and lands in her pocket the next time she opens the app.

Hugs always land inside the app. To also ping the lock screen:

1. Generate VAPID keys:

```bash
npx web-push generate-vapid-keys
```

2. Set them on the server (and in `.env.local` for local):

```bash
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:you@example.com
```

3. On iPhone (iOS 16.4+): Safari → Share → **Add to Home Screen** → open that icon → tap **Enable hug alerts**.
4. You do the same on `/sarmadaccess` so her hugs can ping you.

Without VAPID keys or an enabled device, in-app hugs still work.

## Stack

Next.js, TypeScript, Tailwind CSS, shadcn/ui, Web Push.
