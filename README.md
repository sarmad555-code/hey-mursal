# Hey Mursal

A cute mobile web app made to cheer up Mursal — soft sky blues, pink accents, personal love notes (Jonny, Mango, pasta & nature), an unlimited press-and-hold hug, and a gentle reminder: she never has to explain, you're here if she needs you.

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:4321](http://127.0.0.1:4321).

## Customize her messages

Edit `src/lib/cheer-data.ts` — add strings to the `loveNotes` array and tweak mood messages in `cheerByMood`.

## Hugs

- Mursal taps **Send him a hug**. A paper airplane with a heart trail flies off, and a note goes to sarmadsimab@gmail.com.
- You send one back at [/sarmadaccess](http://127.0.0.1:4321/sarmadaccess). That emails mursalsafar1357@gmail.com and lands in her pocket the next time she opens the app.

Hugs always land inside the app. To also email the inboxes, set `RESEND_API_KEY` and optional `HUG_FROM_EMAIL` (a verified Resend sender). Without that key, `/sarmadaccess` still lists her hugs and a hug you send still appears in her pocket.

## Stack

Next.js, TypeScript, Tailwind CSS, shadcn/ui.
