import {
  Smile,
  Frown,
  ThumbsUp,
  Heart,
  CloudRain,
  Zap,
  Coffee,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Mood } from "@/generated/prisma/enums";
import { Emotion } from "./types";

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

export const MOODS: { label: Mood; icon: React.ReactNode }[] = [
  { label: "Great", icon: <Heart className="w-5 h-5" /> },
  { label: "Good", icon: <ThumbsUp className="w-5 h-5" /> },
  { label: "Okay", icon: <Coffee className="w-5 h-5" /> },
  { label: "Bad", icon: <Frown className="w-5 h-5" /> },
  { label: "Awful", icon: <AlertCircle className="w-5 h-5" /> },
];

export const EMOTIONS: { label: Emotion; icon: React.ReactNode }[] = [
  { label: "Happy", icon: <Smile className="w-5 h-5" /> },
  { label: "Excited", icon: <Zap className="w-5 h-5" /> },
  { label: "Grateful", icon: <Heart className="w-5 h-5" /> },
  { label: "Relaxed", icon: <Coffee className="w-5 h-5" /> },
  { label: "Sad", icon: <CloudRain className="w-5 h-5" /> },
  { label: "Anxious", icon: <AlertCircle className="w-5 h-5" /> },
  { label: "Angry", icon: <Frown className="w-5 h-5" /> },
  { label: "Tired", icon: <MoonIcon className="w-5 h-5" /> },
  { label: "Frustrated", icon: <Frown className="w-5 h-5" /> },
  { label: "Confused", icon: <AlertCircle className="w-5 h-5" /> },
  { label: "Proud", icon: <ThumbsUp className="w-5 h-5" /> },
  { label: "Hopeful", icon: <CheckCircle2 className="w-5 h-5" /> },
];
