import { cn } from "@/lib/utils"

interface LoadingScreenProps {
  message?: string
  className?: string
}

export function LoadingScreen({
  message = "Loading the next experience...",
  className,
}: LoadingScreenProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-[50vh] items-center justify-center overflow-hidden rounded-[2rem] border border-border/60 bg-card/70 px-6 py-16 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl",
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(74,222,243,0.18),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.16),_transparent_35%)]" />

      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/15 bg-primary/5 blur-3xl" />

      <div className="relative flex w-full max-w-md flex-col items-center text-center">
        <div className="loader-orbit">
          <div className="loader-orbit-ring loader-orbit-ring-outer" />
          <div className="loader-orbit-ring loader-orbit-ring-middle" />
          <div className="loader-orbit-ring loader-orbit-ring-inner" />
          <div className="loader-orbit-core" />
          <div className="loader-orbit-dot loader-orbit-dot-cyan" />
          <div className="loader-orbit-dot loader-orbit-dot-teal" />
        </div>

        <div className="mt-8 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-primary/80">
            TechGenz
          </p>
          <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
            Preparing your view
          </h2>
          <p className="text-sm leading-6 text-muted-foreground sm:text-base">{message}</p>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <span className="loader-pulse-bar" />
          <span className="loader-pulse-bar loader-pulse-bar-delay-1" />
          <span className="loader-pulse-bar loader-pulse-bar-delay-2" />
        </div>
      </div>
    </div>
  )
}
