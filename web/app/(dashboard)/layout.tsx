import Link from "next/link";
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-muted/40">
      <div className="hidden md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6 justify-between">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">Musketeers</span>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {pages.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary text-md"
                >
                  <page.icon className="size-5" />
                  {page.name}
                </Link>
              ))}

              {/* <Link
                href="#"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
              >
                <Package className="h-4 w-4" />
                Products
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Users className="h-4 w-4" />
                Customers
              </Link> */}
            </nav>
          </div>
          <div className="mt-auto p-4">
            <ModeToggle />
          </div>
        </div>
      </div>
      <div className="flex flex-col py-4 pr-4 h-[100dvh]">
        {/* <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    6
                  </Badge>
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Products
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Users className="h-5 w-5" />
                  Customers
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Analytics
                </Link>
              </nav>
              <div className="mt-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Upgrade to Pro</CardTitle>
                    <CardDescription>
                      Unlock all features and get unlimited access to our
                      support team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">
                      Upgrade
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header> */}
        {/* <Suspense
          fallback={<div className="animate-pulse bg-slate-200 h-full" />}
        > */}
        <main className="flex flex-1 flex-col overflow-y-auto bg-card rounded-lg border shadow-sm">
          {children}
        </main>
        {/* </Suspense> */}
      </div>
    </div>
  );
}
