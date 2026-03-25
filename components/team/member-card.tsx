import { Github, Linkedin, Mail } from "lucide-react"

interface TeamMemberCardProps {
  name: string
  displayRole: string
  imageUrl?: string | null
  bio?: string | null
  linkedinUrl?: string | null
  githubUrl?: string | null
  email?: string | null
}

export function TeamMemberCard({
  name,
  displayRole,
  imageUrl,
  bio,
  linkedinUrl,
  githubUrl,
  email,
}: TeamMemberCardProps) {
  return (
    <div className="group relative h-full overflow-hidden rounded-[1.4rem] border border-border/60 bg-card/95 shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_20px_45px_rgba(34,197,94,0.14)]">
      <div className="pointer-events-none absolute inset-x-3 top-0 h-20 rounded-b-full bg-linear-to-b from-primary/10 to-transparent blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative aspect-[4/4.8] overflow-hidden bg-secondary sm:aspect-square">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/20 to-accent/20">
            <span className="text-4xl font-bold text-primary/40 sm:text-5xl">{name.charAt(0)}</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-background/55 to-transparent" />
      </div>
      <div className="space-y-3 p-3 sm:p-5">
        <div className="space-y-1">
          <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-foreground sm:text-base">
            {name}
          </h3>
          <p className="line-clamp-2 text-xs font-medium text-primary sm:text-sm">{displayRole}</p>
        </div>
        {bio && (
          <p className="line-clamp-3 text-xs leading-5 text-muted-foreground sm:text-sm">
            {bio}
          </p>
        )}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border/60 p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label={`${name} LinkedIn`}
            >
              <Linkedin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border/60 p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label={`${name} GitHub`}
            >
              <Github className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="rounded-full border border-border/60 p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label={`Email ${name}`}
            >
              <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
