import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { TeamMemberCard } from "@/components/team/member-card"

export async function CoreTeam() {
  const supabase = await createClient()

  const { data: teamMembers, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("is_active", true)
    .in("section", ["founder", "co_founder", "current_team"])
    .order("sort_order", { ascending: true })
    .limit(4)

  const previewMembers = error ? [] : teamMembers || []

  return (
    <section className="relative py-24">
      <div className="absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-accent/15 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Meet Our Team
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            The founders and current team members driving TechGenz forward.
          </p>
        </div>

        {previewMembers.length > 0 ? (
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {previewMembers.map((member) => (
              <TeamMemberCard
                key={member.id}
                name={member.name}
                displayRole={member.display_role}
                imageUrl={member.image_url}
                bio={member.bio}
                linkedinUrl={member.linkedin_url}
                githubUrl={member.github_url}
                email={member.email}
              />
            ))}
          </div>
        ) : (
          <div className="mt-16 rounded-2xl border border-border/50 bg-card p-10 text-center text-muted-foreground">
            {error
              ? "Team setup is not ready yet. Run the team table SQL script and then add members from the admin panel."
              : "Team members will appear here once they are added by the admin."}
          </div>
        )}

        <div className="mt-10 text-center">
          <Button asChild>
            <Link href="/team">View Full Team</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
