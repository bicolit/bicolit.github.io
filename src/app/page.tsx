import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
        {"// Bicol IT"}
      </p>
      <h1 className="bg-gradient-to-r from-brand-violet to-brand-cyan bg-clip-text font-display text-4xl font-bold text-transparent sm:text-5xl">
        Innovating Tomorrow, Together
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Website rebuild in progress — Phase 2: styling foundation (Tailwind 4,
        shadcn/ui, dark/light theme).
      </p>
    </main>
  );
}
