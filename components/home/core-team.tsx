import { Linkedin, Github, Mail } from "lucide-react"

const coreTeam = [
  {
    name: "Arjun Patel",
    role: "President",
    image: "/team/president.jpg",
    socials: { linkedin: "#", github: "#", email: "president@techgenz.in" },
  },
  {
    name: "Priya Sharma",
    role: "Vice President",
    image: "/team/vice-president.jpg",
    socials: { linkedin: "#", github: "#", email: "vp@techgenz.in" },
  },
  {
    name: "Rahul Verma",
    role: "Technical Lead",
    image: "/team/tech-lead.jpg",
    socials: { linkedin: "#", github: "#", email: "tech@techgenz.in" },
  },
  {
    name: "Sneha Gupta",
    role: "Event Coordinator",
    image: "/team/events.jpg",
    socials: { linkedin: "#", github: "#", email: "events@techgenz.in" },
  },
]

export function CoreTeam() {
  return (
    <section className="relative py-24">
            <div className="absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-accent/15 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Meet Our Core Team
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            The passionate individuals driving TechGenz forward.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {coreTeam.map((member, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card transition-all hover:border-primary/50"
            >
              <div className="aspect-square overflow-hidden bg-secondary">
                <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/20 to-accent/20">
                  <span className="text-5xl font-bold text-primary/40">
                    {member.name.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-primary">{member.role}</p>
                <div className="mt-4 flex gap-3">
                  <a
                    href={member.socials.linkedin}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    aria-label={`${member.name}'s LinkedIn`}
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href={member.socials.github}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    aria-label={`${member.name}'s GitHub`}
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  <a
                    href={`mailto:${member.socials.email}`}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    aria-label={`Email ${member.name}`}
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
