"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookOpen, History } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <BookOpen className="h-6 w-6" />
              <span>Mindful Journal</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant={pathname === "/" ? "default" : "ghost"} size="sm" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Journal
              </Button>
            </Link>
            <Link href="/check-ins">
              <Button
                variant={pathname.startsWith("/check-ins") ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <History className="h-4 w-4" />
                History
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
