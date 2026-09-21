/** Personal pocket for Mursal — edit loveNotes below to add your own messages. */

export const herName = "Mursal";
export const herNickname = "My Chud";

export type MoodId = "tired" | "heavy" | "anxious" | "lonely" | "okay";

export type Mood = {
  id: MoodId;
  label: string;
  hint: string;
};

export type CheerContent = {
  headline: string;
  message: string;
  reminder: string;
};

export const moods: Mood[] = [
  { id: "tired", label: "A little sleepy", hint: "Need a soft landing" },
  { id: "heavy", label: "A bit heavy", hint: "Everything feels a lot" },
  { id: "anxious", label: "Butterflies", hint: "Mind won't settle" },
  { id: "lonely", label: "Missing someone", hint: "Could use a cuddle" },
  { id: "okay", label: "Okay-ish", hint: "Just want a little love" },
];

export const cheerByMood: Record<MoodId, CheerContent> = {
  tired: {
    headline: `Rest easy, ${herName}.`,
    message:
      "You don't have to tell me what's going on. Truly. Just know I'm here — for the quiet days, the heavy ones, and every soft in-between.",
    reminder: "Jonny can keep watch. I've got you too.",
  },
  heavy: {
    headline: "You don't owe me the story.",
    message:
      "Whatever you're carrying, you don't have to explain it. I'm still right here if you need me — no pressure, no questions required. Just a soft place to land.",
    reminder:
      "If it feels like the world is against you — it's us against the world. You don't go through it alone.",
  },
  anxious: {
    headline: "Breathe with me, love.",
    message:
      "You don't have to tell me what's swirling. I'm here anyway — steady, silly if you need a laugh, quiet if you don't. Take the next breath. I've got this minute with you.",
    reminder: "Even fluttery hearts are still so loved.",
  },
  lonely: {
    headline: `I'm thinking of you, ${herName}.`,
    message:
      "You don't have to say a word about what's going on. I'm here if you need me — always. Until then, picture Jonny's soft eyes and Mango chirping somewhere nearby. You're not alone.",
    reminder: "Someone made this pocket so you'd never feel far from care.",
  },
  okay: {
    headline: "Then let's make it sweeter.",
    message:
      "Okay is a cute place to start. And just so you know — you never have to report in. I'm here if you need me, and I'm proud of you either way.",
    reminder: "Funny, beautiful you — spoiled with care for no reason at all.",
  },
};

/**
 * Add your own notes for Mursal here anytime.
 * Drop new strings into this list — they'll show up when she taps.
 */
export const loveNotes = [
  "If you're reading this when you feel like the world is against you, remember: it's us against the world. You don't have to go through anything alone.",
  "My Chud — that's you. The name I keep just for you, even on the quiet days.",
  "Remember central London? Just us, walking around, spending the day together. I still carry that afternoon with me.",
  "You are so loving and caring to everyone around you. The world gets softer because you walk through it.",
  `${herName}, you don't have to tell me what's going on. I'm here if you need me — no explaining required.`,
  "You're funny in the way that makes ordinary days feel lighter. Never stop being you.",
  "You're beautiful — not as a compliment to collect, just as a quiet fact about the world.",
  "Somewhere there's a perfect plate of pasta with your name on it. I believe in that deeply.",
  "Cooking with you (or thinking about you cooking) feels like the softest kind of home.",
  "Baking days, flour on the counter, something sweet in the oven — that's peak Mursal magic.",
  "Nature looks better when you're in it. Trees, sky, you — unfair combo.",
  "Give Jonny an extra scratch from me. Goodest boy energy. Always.",
  "Tell Mango I said hi. Tiny bird, huge personality — sounds familiar.",
  "Jonny + Mango + you = the cutest little ecosystem I know.",
  "You make kitchens feel warmer and trails feel kinder. That's a talent.",
  "If today is hard, you still don't owe me the details. I'm here. Full stop.",
  "Come back whenever. This pocket stays open — hugs included, no time limit.",
];
