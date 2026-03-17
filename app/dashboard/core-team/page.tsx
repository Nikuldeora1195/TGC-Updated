import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Calendar, Users, HelpCircle, Image, Bell, Award } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function CoreTeamDashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: member } = await supabase
    .from("members")
    .select("*")
    .eq("id", user.id)
    .single()

  if (member?.role !== "core_team" && member?.role !== "admin") {
    redirect("/dashboard")
  }

  // Fetch stats
  const { count: totalMembers } = await supabase
    .from("members")
    .select("*", { count: "exact", head: true })

  const { count: totalEvents } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })

  const { count: openQueries } = await supabase
    .from("queries")
    .select("*", { count: "exact", head: true })
    .eq("status", "open")

  const { count: galleryImages } = await supabase
    .from("gallery")
    .select("*", { count: "exact", head: true })

  const { data: recentQueries } = await supabase
    .from("queries")
    .select("*, members(name)")
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: upcomingEvents } = await supabase
    .from("events")
    .select("*")
    .gte("event_date", new Date().toISOString())
    .order("event_date", { ascending: true })
    .limit(3)

  const quickActions = [
    { href: "/dashboard/events/new", label: "Create Event", icon: Calendar, color: "bg-blue-500/20 text-blue-400" },
    { href: "/dashboard/gallery/upload", label: "Upload Photos", icon: Image, color: "bg-green-500/20 text-green-400" },
    { href: "/dashboard/notifications/new", label: "Send Notification", icon: Bell, color: "bg-yellow-500/20 text-yellow-400" },
    { href: "/dashboard/certificates/issue", label: "Issue Certificate", icon: Award, color: "bg-purple-500/20 text-purple-400" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
          Core Team Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage events, queries, and community activities.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Members</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Queries</CardTitle>
            <HelpCircle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openQueries || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Gallery Images</CardTitle>
            <Image className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{galleryImages || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-secondary"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="font-medium text-foreground">{action.label}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Open Queries */}
        <Card>
          <CardHeader>
            <CardTitle>Open Queries</CardTitle>
            <CardDescription>Queries waiting for response</CardDescription>
          </CardHeader>
          <CardContent>
            {recentQueries && recentQueries.length > 0 ? (
              <div className="space-y-4">
                {recentQueries.map((query: any) => (
                  <Link
                    key={query.id}
                    href={`/dashboard/queries/${query.id}`}
                    className="block rounded-lg border border-border p-4 transition-colors hover:bg-secondary"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">{query.subject}</h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          by {query.members?.name || "Unknown"}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(query.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-muted-foreground">No open queries</p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Events you need to manage</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingEvents && upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/dashboard/events/${event.id}`}
                    className="block rounded-lg border border-border p-4 transition-colors hover:bg-secondary"
                  >
                    <h4 className="font-medium text-foreground">{event.title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {new Date(event.event_date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-muted-foreground">No upcoming events</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
