import { HeroInteractiveBackground } from "@/components/home/hero-interactive-background"
import Link from "next/link"
import { ArrowRight, CalendarDays, Presentation, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-16">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,200,200,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,200,0.2)_1px,transparent_1px)] bg-size-[64px_64px]" />
      <HeroInteractiveBackground containerClassName="hero-background pointer-events-none absolute inset-0 overflow-hidden" />
      
      {/* Glowing orbs */}
      <div className="absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-accent/15 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Pacific Institute of Technology
        </div>

        <h1 className="max-w-4xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          Where Future{" "}
          <span className="bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Tech Leaders
          </span>{" "}
          Unite
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
          Join TechGenz, the official tech community of Pacific Institute of Technology. 
          Connect with fellow innovators, attend workshops, and build the future together.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button size="lg" asChild className="gap-2 text-base">
            <Link href="/auth/sign-up">
              Become a Member
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="text-base">
            <Link href="/auth/login">Log In</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="gap-2 text-base">
            <Link href="/events">Explore Events</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <CalendarDays className="h-6 w-6 text-primary" />
            </div>
            <span className="text-3xl font-bold text-foreground">10+</span>
            <span className="text-sm text-muted-foreground">Meetings</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Presentation className="h-6 w-6 text-primary" />
            </div>
            <span className="text-3xl font-bold text-foreground">5+</span>
            <span className="text-sm text-muted-foreground">Seminars</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <span className="text-3xl font-bold text-foreground">More</span>
            <span className="text-sm text-muted-foreground">Many More To Go</span>
          </div>
        </div>
      </div>
    </section>
  )
}
