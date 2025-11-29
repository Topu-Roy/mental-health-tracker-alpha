"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Flame, Sparkles, RotateCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SOSPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SOSPanel({ open, onOpenChange }: SOSPanelProps) {
  const [burnText, setBurnText] = useState("");
  const [isBurning, setIsBurning] = useState(false);
  const [burned, setBurned] = useState(false);

  const handleBurn = () => {
    if (!burnText.trim()) return;
    setIsBurning(true);
    setTimeout(() => {
      setBurned(true);
      setBurnText("");
      setIsBurning(false);
    }, 2500);
  };

  const handleReset = () => {
    setBurned(false);
    setBurnText("");
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after dialog closes
    setTimeout(() => {
      setBurned(false);
      setBurnText("");
      setIsBurning(false);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl border-orange-200 dark:border-orange-900/50">
        <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 via-transparent to-red-500/5 pointer-events-none rounded-lg" />

        <DialogHeader className="relative">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Flame className={`h-6 w-6 ${isBurning ? "animate-pulse text-orange-600" : "text-orange-500"}`} />
            The Burn Page
            {burned && <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse ml-auto" />}
          </DialogTitle>
          <DialogDescription className="text-base">
            Release what&apos;s weighing you down. Write it out, then watch it disappear.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!burned ? (
            <div
              className={`relative transition-all duration-2000 ${
                isBurning ? "opacity-0 blur-2xl scale-90 rotate-1" : "opacity-100 scale-100 rotate-0"
              }`}
            >
              <Textarea
                value={burnText}
                onChange={(e) => setBurnText(e.target.value)}
                placeholder="Let it all out... What's bothering you? What do you need to release?"
                className="min-h-[200px] resize-none border-orange-100 dark:border-orange-900/50 focus-visible:ring-orange-500 text-base"
                disabled={isBurning}
              />
              {isBurning && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-6xl animate-bounce">🔥</div>
                </div>
              )}
            </div>
          ) : (
            <div className="min-h-[200px] flex flex-col items-center justify-center gap-4 text-center animate-in zoom-in duration-700">
              <div className="text-5xl mb-2">✨</div>
              <div className="space-y-2">
                <p className="text-xl font-medium">It&apos;s gone now.</p>
                <p className="text-muted-foreground">Take a deep breath. You&apos;ve let it go.</p>
              </div>
            </div>
          )}

          <div className="text-center text-sm text-muted-foreground pt-2">
            <p>💭 This space is private. Nothing is saved. Just let go.</p>
          </div>
        </div>

        <DialogFooter className="flex gap-3 flex-col sm:flex-row">
          {!burned ? (
            <>
              <Button variant="ghost" onClick={handleClose} className="w-full sm:w-auto order-2 sm:order-1">
                Skip
              </Button>
              <Button
                variant="destructive"
                onClick={handleBurn}
                disabled={!burnText.trim() || isBurning}
                className="w-full sm:flex-1 gap-2 text-base h-11 order-1 sm:order-2"
                size="lg"
              >
                <Flame className={`h-5 w-5 ${isBurning ? "animate-ping" : ""}`} />
                {isBurning ? "Burning..." : "Burn It Away"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleReset} className="w-full sm:flex-1 gap-2">
                <RotateCcw className="h-4 w-4" />
                Release More
              </Button>
              <Button
                onClick={handleClose}
                className="w-full sm:flex-1 gap-2 bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                <Sparkles className="h-4 w-4" />
                Continue
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
