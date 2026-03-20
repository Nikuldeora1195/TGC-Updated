import Image from "next/image"
import Link from "next/link"
import { Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,200,200,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,200,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20">
          <Mail className="h-8 w-8 text-primary" />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-foreground">Check your email</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          We&apos;ve sent you a confirmation link to verify your email address. 
          Please check your inbox and click the link to activate your TechGenz account.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/auth/login" className="gap-2">
              Go to Login
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>

        <div className="mt-12 flex items-center gap-2 text-sm text-muted-foreground">
          <Image src="/apple-icon.png" alt="TechGenz logo" width={16} height={16} className="h-4 w-4 object-contain" />
          <span>TechGenz - Pacific Institute of Technology</span>
        </div>
      </div>
    </div>
  )
}
