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
  { id: "tired", label: "Tired", hint: "Running on empty" },
  { id: "heavy", label: "Heavy", hint: "Everything feels a lot" },
  { id: "anxious", label: "Anxious", hint: "Mind won't quiet down" },
  { id: "lonely", label: "Lonely", hint: "Could use a soft landing" },
  { id: "okay", label: "Okay-ish", hint: "Just want a little love" },
];

export const cheerByMood: Record<MoodId, CheerContent> = {
  tired: {
    headline: "Rest is allowed.",
    message:
      "You don't have to earn softness today. Put the world down for a minute — I've got you.",
    reminder: "Being tired doesn't make you less wonderful.",
  },
  heavy: {
    headline: "You can put it down.",
    message:
      "Whatever you're carrying, you don't have to carry it alone right now. Breathe. I'm right here.",
    reminder: "Heavy days still belong to someone deeply loved.",
  },
  anxious: {
    headline: "One breath. Then another.",
    message:
      "You are safe in this moment. The spiral can wait outside. Come sit with me for a second.",
    reminder: "Your feelings are valid. You are still okay.",
  },
  lonely: {
    headline: "You're not alone in this.",
    message:
      "Even across any distance, you're held. Someone is thinking of you — right now, on purpose.",
    reminder: "You matter more than you know in quiet moments.",
  },
  okay: {
    headline: "Then let's make it warmer.",
    message:
      "Okay is a fine place to start. Here's a little extra love, just because you exist.",
    reminder: "You don't need a reason to be cherished.",
  },
};

export const loveNotes = [
  "You make ordinary days feel like they matter.",
  "I notice the quiet ways you try — and I love you for them.",
  "Your laugh is still one of my favorite sounds.",
  "You are allowed to take up space. Softly. Fully. Freely.",
  "The world is luckier with you in it. So am I.",
  "Even on hard days, you are still my favorite person.",
  "Nothing about you needs fixing to be worthy of care.",
  "If I could bottle calm and hand it to you, I would. This is the closest I could get.",
  "You're doing better than you think. Truly.",
  "Come back here anytime. This little pocket stays open for you.",
];
