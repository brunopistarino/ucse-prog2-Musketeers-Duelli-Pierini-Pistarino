import { Suspense } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse bg-slate-200 h-full rounded-lg" />
      }
    >
      <main className="flex flex-1 flex-col overflow-y-auto bg-card rounded-lg border shadow-sm">
        {children}
      </main>
    </Suspense>
  );
}
