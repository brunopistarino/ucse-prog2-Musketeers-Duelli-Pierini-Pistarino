"use client";
import ModeToggle from "@/components/mode-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { logout } from "@/lib/actions/user";
import { pages } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ChefHat, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <Button
        size="lg"
        variant="ghost"
        className="gap-2 cursor-default text-xl hover:bg-transparent font-semibold"
      >
        <ChefHat size={24} />
        Musketeers
      </Button>
      <nav className="grid">
        {pages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "gap-2 justify-start",
              pathname === page.href
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-transparent"
            )}
          >
            <page.icon className="size-5" />
            {page.name}
          </Link>
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-2">
        <ModeToggle />
        <Button className="gap-2" variant="secondary" onClick={() => logout()}>
          <LogOut size={16} />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
