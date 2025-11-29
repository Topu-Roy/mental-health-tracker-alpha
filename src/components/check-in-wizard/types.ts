export type Emotion =
  | "Happy"
  | "Excited"
  | "Relaxed"
  | "Sad"
  | "Anxious"
  | "Angry"
  | "Tired"
  | "Frustrated"
  | "Proud"
  | "Grateful"
  | "Confused"
  | "Hopeful";

export interface DailyCheckInProps {
  onComplete: () => void;
  onCancel: () => void;
}
