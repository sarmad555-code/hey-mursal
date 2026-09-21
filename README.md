# Hey Love

A mobile web app made to cheer up someone special — soft love notes, a press-and-hold hug, and gentle reminders for hard days.

## Run locally

```bash
npm install
npm run dev -- -p 4321
```

Open [http://127.0.0.1:4321](http://127.0.0.1:4321).

## What it does

1. **Welcome** — a warm landing just for her  
2. **Mood check-in** — tired, heavy, anxious, lonely, or okay-ish  
3. **Personal cheer** — a message matched to her mood, plus a hold-for-a-hug moment  
4. **Love notes** — tap through short notes written for her  
5. **Close** — a soft goodbye she can reopen anytime  

## Customize

Edit messages and moods in `src/lib/cheer-data.ts`. Swap the brand name in `src/components/cheer-app.tsx` and `src/app/layout.tsx` if you want something more personal.

## Stack

Next.js, TypeScript, Tailwind CSS, shadcn/ui.
