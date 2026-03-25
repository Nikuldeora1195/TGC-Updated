import { Code2, Lightbulb, Network, Rocket, Shield, Trophy } from "lucide-react"

const features = [
  {
    icon: Code2,
    title: "Technical Workshops",
    description: "Hands-on sessions covering web development, AI/ML, cloud computing, and emerging technologies.",
  },
  {
    icon: Network,
    title: "Networking Events",
    description: "Connect with industry professionals, alumni, and fellow tech enthusiasts at our meetups.",
  },
  {
    icon: Trophy,
    title: "Hackathons",
    description: "Participate in coding competitions and showcase your skills to win exciting prizes.",
  },
  {
    icon: Lightbulb,
    title: "Project Collaborations",
    description: "Team up with peers to build real-world projects and expand your portfolio.",
  },
  {
    icon: Shield,
    title: "Certifications",
    description: "Earn certificates for event participation and skill achievements recognized by industry.",
  },
  {
    icon: Rocket,
    title: "Career Guidance",
    description: "Get mentorship and guidance from seniors and industry experts for your career path.",
  },
]

export function Features() {
  return (
    <section className="relative border-t border-border/50 bg-card/50 py-24">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(0,200,200,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,200,0.2)_1px,transparent_1px)] bg-size-[64px_64px]" />
               <div className="absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-accent/15 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            What We Offer
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            TechGenz provides a comprehensive platform for students to learn, grow, and connect.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-border/50 bg-background/50 p-6 transition-all hover:border-primary/50 hover:bg-background"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
