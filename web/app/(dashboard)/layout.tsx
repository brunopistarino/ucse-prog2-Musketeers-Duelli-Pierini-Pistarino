import { ChefHat, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
      <div className="flex flex-col md:py-2 lg:py-4 md:pr-2 lg:pr-4 h-[100dvh] overflow-x-auto">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden justify-between">
          <Button
            size="lg"
            variant="ghost"
            className="gap-2 cursor-default text-xl hover:bg-transparent font-semibold px-2"
          >
            <ChefHat size={24} />
            Musketeers
          </Button>
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
        {children}
      </div>
    </div>
  );
}
