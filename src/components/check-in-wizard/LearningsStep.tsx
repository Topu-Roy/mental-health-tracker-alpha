import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface LearningsStepProps {
  learnings: string[];
  setLearnings: React.Dispatch<React.SetStateAction<string[]>>;
  learningInput: string;
  setLearningInput: React.Dispatch<React.SetStateAction<string>>;
  handleAddItem: (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    item: string,
    setInput: React.Dispatch<React.SetStateAction<string>>
  ) => void;
  handleRemoveItem: (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => void;
}

export function LearningsStep({
  learnings,
  setLearnings,
  learningInput,
  setLearningInput,
  handleAddItem,
  handleRemoveItem,
}: LearningsStepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-2">
        <Label className="text-lg font-medium">Learnings</Label>
        <p className="text-sm text-muted-foreground">Key takeaways from today.</p>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Textarea
            value={learningInput}
            onChange={(e) => setLearningInput(e.target.value)}
            placeholder="I learned that..."
            className="min-h-[100px] resize-none pr-12 bg-secondary/20 focus:bg-background transition-colors"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddItem(learnings, setLearnings, learningInput, setLearningInput);
              }
            }}
          />
          <Button
            onClick={() => handleAddItem(learnings, setLearnings, learningInput, setLearningInput)}
            size="icon"
            className="absolute bottom-3 right-3 h-8 w-8 rounded-full shadow-sm"
            disabled={!learningInput.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {learnings.map((learning, index) => (
            <div
              key={index}
              className="group flex items-center gap-2 pl-3 pr-1 py-1.5 bg-secondary/50 rounded-full text-sm animate-in zoom-in duration-200"
            >
              <span className="max-w-[200px] truncate">{learning}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive"
                onClick={() => handleRemoveItem(learnings, setLearnings, index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
