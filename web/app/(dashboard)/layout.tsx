import Link from "next/link";
import { LogOut, ChefHat, Search, Menu, CircleUser } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { pages } from "@/lib/constants";
import { Suspense } from "react";
import ModeToggle from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import Navigation from "./navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-muted/40">
      <div className="hidden md:block p-2 lg:p-4">
        <Navigation />
      </div>
      <div className="flex flex-col md:py-4 md:pr-4 h-[100dvh]">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 ">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <Navigation />
            </SheetContent>
          </Sheet>
        </header>
        {/* <Suspense
          fallback={
            <div className="animate-pulse bg-slate-200 h-full rounded-lg" />
          }
        >
          <main className="flex flex-1 flex-col overflow-y-auto bg-card rounded-lg border shadow-sm">
            {children}
          </main>
        </Suspense> */}
        {children}
      </div>
    </div>
  );
}
