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
    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card transition-all hover:border-primary/50">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/20 to-accent/20">
            <span className="text-5xl font-bold text-primary/40">{name.charAt(0)}</span>
          </div>
        )}
      </div>
      <div className="space-y-3 p-5">
        <div>
          <h3 className="font-semibold text-foreground">{name}</h3>
          <p className="text-sm text-primary">{displayRole}</p>
        </div>
        {bio && <p className="text-sm text-muted-foreground line-clamp-3">{bio}</p>}
        <div className="flex gap-3">
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label={`${name} LinkedIn`}
            >
              <Linkedin className="h-4 w-4" />
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label={`${name} GitHub`}
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label={`Email ${name}`}
            >
              <Mail className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
