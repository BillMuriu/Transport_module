import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { MainNav } from "./main-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur bg-background/60 border-b border-border/30">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <MainNav />
      </div>
    </header>
  );
}
