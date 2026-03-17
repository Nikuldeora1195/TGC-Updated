import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/home/hero"
import { Features } from "@/components/home/features"
import { CoreTeam } from "@/components/home/core-team"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <CoreTeam />
      </main>
      <Footer />
    </div>
  )
}
