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
    headline: "Nap-approved. Always.",
    message:
      "You don't have to be bright and shiny right now. Close your eyes for a second — I'm right here keeping watch.",
    reminder: "Tired you is still my favorite you.",
  },
  heavy: {
    headline: "Come sit with me.",
    message:
      "Whatever you're carrying, you can set it down for a minute. I've got both arms open.",
    reminder: "Heavy days still get soft blue skies and pink hugs.",
  },
  anxious: {
    headline: "Breathe with me, love.",
    message:
      "In… and out. You're safe. The spiral can wait outside while we stay right here.",
    reminder: "Even fluttery hearts are still so loved.",
  },
  lonely: {
    headline: "I'm thinking of you.",
    message:
      "Across any distance, you're held. Someone made this little pocket just so you'd never feel alone in it.",
    reminder: "You are missed in the sweetest way.",
  },
  okay: {
    headline: "Then let's make it sweeter.",
    message:
      "Okay is a cute place to start. Here's an extra sprinkle of love, just because you're you.",
    reminder: "You don't need a reason to be spoiled with care.",
  },
};

export const loveNotes = [
  "You make ordinary days feel sparkly.",
  "I notice the quiet ways you try — and I adore you for them.",
  "Your smile is still my soft spot.",
  "You are allowed to take up space. Softly. Fully. Freely.",
  "The world is luckier with you in it. So am I.",
  "Even on cloudy days, you're my favorite person.",
  "Nothing about you needs fixing to be worthy of care.",
  "If I could wrap you in a blue-sky hug, I would. This is the closest I could get.",
  "You're doing better than you think. Truly.",
  "Come back here anytime. This cute little pocket stays open for you.",
];
