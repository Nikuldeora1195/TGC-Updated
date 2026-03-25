import Link from "next/link"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,200,200,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,200,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/20">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-foreground">Authentication Error</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Something went wrong during authentication. This could be due to an expired 
          link or an invalid request. Please try again.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/auth/login" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
