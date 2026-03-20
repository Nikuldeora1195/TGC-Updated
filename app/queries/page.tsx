import Link from "next/link"
import { MessageSquare, ArrowRight, LogIn } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function QueriesLandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        <section className="relative border-b border-border/50 bg-card/30 py-20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,200,200,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,200,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
          <div className="absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-accent/15 blur-3xl" />

          <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Need Help or Have a Query?
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Sign in to submit your question through the TechGenz help desk and get a response from the team.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Access the Query Desk</CardTitle>
                <CardDescription>
                  You need an account to open the member help desk and track replies.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4 py-10 sm:flex-row sm:justify-center">
                <Button asChild className="gap-2">
                  <Link href="/auth/login">
                    <LogIn className="h-4 w-4" />
                    Log In
                  </Link>
                </Button>
                <Button variant="outline" asChild className="gap-2">
                  <Link href="/auth/sign-up">
                    Sign Up
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
