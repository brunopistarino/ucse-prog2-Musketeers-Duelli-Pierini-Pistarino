import { Suspense } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse bg-muted-foreground/25 h-full rounded-lg" />
      }
    >
      <main className="flex flex-1 flex-col overflow-y-auto bg-card md:rounded-lg md:border md:shadow-sm">
        {children}
      </main>
    </Suspense>
  );
}
