import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { TeamMemberCard } from "@/components/team/member-card"

function groupByBatch(members: any[]) {
  return members.reduce<Record<string, any[]>>((acc, member) => {
    const key = member.batch_label || "Previous Team"
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(member)
    return acc
  }, {})
}

export default async function TeamPage() {
  const supabase = await createClient()

  const { data: teamMembers, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  const safeMembers = error ? [] : teamMembers || []

  const founders = safeMembers.filter(
    (member) => member.section === "founder" || member.section === "co_founder"
  )
  const currentTeam = safeMembers.filter((member) => member.section === "current_team")
  const previousBatches = safeMembers.filter((member) => member.section === "previous_batch")
  const groupedPreviousBatches = Object.entries(groupByBatch(previousBatches))

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        <section className="relative border-b border-border/50 bg-card/30 py-20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,200,200,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,200,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
          <div className="absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-accent/15 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Team TechGenz
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
              Meet the founders, the current leadership team, and the previous batches that helped
              build the community.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Founders</h2>
              <p className="mt-2 text-muted-foreground">
                The people who started the TechGenz journey.
              </p>
            </div>

            {founders.length > 0 ? (
              <div className="mt-10 grid gap-8 md:grid-cols-2">
                {founders.slice(0, 2).map((member) => (
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
              <div className="mt-10 rounded-2xl border border-border/50 bg-card p-10 text-center text-muted-foreground">
                {error
                  ? "The team page will appear here after the team table is created and populated by the admin."
                  : "Founder details will appear here once they are added."}
              </div>
            )}
          </div>
        </section>

        <section className="border-y border-border/50 bg-card/30 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Current Team</h2>
              <p className="mt-2 text-muted-foreground">
                The current members leading events, projects, and community initiatives.
              </p>
            </div>

            {currentTeam.length > 0 ? (
              <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {currentTeam.map((member) => (
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
              <div className="mt-10 rounded-2xl border border-border/50 bg-card p-10 text-center text-muted-foreground">
                {error
                  ? "The team page will appear here after the team table is created and populated by the admin."
                  : "Current team members will appear here once they are added."}
              </div>
            )}
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Previous Batches</h2>
              <p className="mt-2 text-muted-foreground">
                Alumni teams that shaped TechGenz over the years.
              </p>
            </div>

            {groupedPreviousBatches.length > 0 ? (
              <div className="mt-10 space-y-12">
                {groupedPreviousBatches.map(([batchLabel, members]) => (
                  <div key={batchLabel}>
                    <h3 className="text-xl font-semibold text-foreground">{batchLabel}</h3>
                    <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {members.map((member) => (
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
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-10 rounded-2xl border border-border/50 bg-card p-10 text-center text-muted-foreground">
                {error
                  ? "The team page will appear here after the team table is created and populated by the admin."
                  : "Previous batch teams will appear here once they are added."}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
