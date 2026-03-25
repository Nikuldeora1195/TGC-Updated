import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CoreTeam } from "@/components/home/core-team"
import { Target, Eye, Heart, Zap, Mail, Instagram, Linkedin, MessageCircle } from "lucide-react"

const CONTACT_EMAIL = "techgenzpacific@gmail.com"
const INSTAGRAM_URL = "https://www.instagram.com/techgenz.pacific/"
const LINKEDIN_URL = "https://linkedin.com/company/techgenzpacific"
const WHATSAPP_URL = "https://chat.whatsapp.com/Lk2Gz7foHH9Ko12wTfIctA?mode=ac_c"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative border-b border-border/50 bg-card/30 py-20">
                <div className="absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-accent/15 blur-3xl" />
          
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,200,200,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,200,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
          <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              About TechGenz
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              The official tech community of Pacific Institute of Technology, dedicated to 
              fostering innovation and building the next generation of tech leaders.
            </p>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-2xl border border-border/50 bg-card p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">Our Mission</h3>
                <p className="mt-3 text-muted-foreground">
                  To create a vibrant ecosystem where students can learn cutting-edge 
                  technologies, collaborate on innovative projects, and prepare for 
                  successful careers in the tech industry.
                </p>
              </div>

              <div className="rounded-2xl border border-border/50 bg-card p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Eye className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">Our Vision</h3>
                <p className="mt-3 text-muted-foreground">
                  To be the premier student tech community in the region, recognized for 
                  producing skilled graduates who drive technological innovation and 
                  contribute to society.
                </p>
              </div>

              <div className="rounded-2xl border border-border/50 bg-card p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Heart className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">Our Values</h3>
                <p className="mt-3 text-muted-foreground">
                  Innovation, collaboration, continuous learning, inclusivity, and 
                  excellence. We believe in empowering every member to reach their 
                  full potential.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="border-y border-border/50 bg-card/30 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
                <Zap className="h-4 w-4" />
                Our Story
              </div>
              <h2 className="mt-6 text-3xl font-bold text-foreground">
                Building Tomorrow&apos;s Tech Leaders
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                TechGenz was founded in 2020 by a group of passionate students at 
                Pacific Institute of Technology who believed in the power of community 
                learning. What started as a small study group has grown into an active 
                community that keeps creating opportunities to learn, build, and collaborate.
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                So far, we have hosted 10+ meetings and 5+ seminars, with many more sessions, 
                collaborations, and community initiatives still ahead. Every activity is built 
                to help students grow with practical exposure and shared learning.
              </p>
            </div>
          </div>
        </section>

        {/* Core Team */}
        <CoreTeam />

        {/* Contact Us */}
        <section id="contact" className="border-t border-border/50 bg-card/30 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-foreground">Contact Us</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Reach out to the TechGenz team for collaborations, queries, or community support.
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-border/50 bg-card p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">Email</h3>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="mt-2 block break-all text-muted-foreground transition-colors hover:text-foreground"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>

              <div className="rounded-2xl border border-border/50 bg-card p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Instagram className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">Instagram</h3>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-muted-foreground transition-colors hover:text-foreground"
                >
                  @techgenz.pacific
                </a>
              </div>

              <div className="rounded-2xl border border-border/50 bg-card p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Linkedin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">LinkedIn</h3>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block break-all text-muted-foreground transition-colors hover:text-foreground"
                >
                  linkedin.com/company/techgenzpacific
                </a>
              </div>

              <div className="rounded-2xl border border-border/50 bg-card p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">WhatsApp</h3>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block break-all text-muted-foreground transition-colors hover:text-foreground"
                >
                  Join Community
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
