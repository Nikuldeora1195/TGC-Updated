import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Calendar, Users, HelpCircle, Image, Bell, Award, Settings, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: member } = await supabase
    .from("members")
    .select("*")
    .eq("id", user.id)
    .single()

  if (member?.role !== "admin") {
    redirect("/dashboard")
  }

  // Fetch comprehensive stats
  const { count: totalMembers } = await supabase
    .from("members")
    .select("*", { count: "exact", head: true })

  const { count: studentCount } = await supabase
    .from("members")
    .select("*", { count: "exact", head: true })
    .eq("role", "student")

  const { count: coreTeamCount } = await supabase
    .from("members")
    .select("*", { count: "exact", head: true })
    .eq("role", "core_team")

  const { count: totalEvents } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })

  const { count: certificatesIssued } = await supabase
    .from("certificates")
    .select("*", { count: "exact", head: true })

  const { count: openQueries } = await supabase
    .from("queries")
    .select("*", { count: "exact", head: true })
    .eq("status", "open")

  const { count: galleryImages } = await supabase
    .from("gallery")
    .select("*", { count: "exact", head: true })

  const { data: recentMembers } = await supabase
    .from("members")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  const adminActions = [
    { href: "/dashboard/members", label: "Manage Members", icon: Users, color: "bg-blue-500/20 text-blue-400", desc: "View and manage all members" },
    { href: "/dashboard/events/new", label: "Create Event", icon: Calendar, color: "bg-green-500/20 text-green-400", desc: "Add new community events" },
    { href: "/dashboard/certificates/issue", label: "Issue Certificates", icon: Award, color: "bg-purple-500/20 text-purple-400", desc: "Issue certificates to members" },
    { href: "/dashboard/notifications/new", label: "Send Notification", icon: Bell, color: "bg-yellow-500/20 text-yellow-400", desc: "Broadcast to all members" },
    { href: "/dashboard/gallery/upload", label: "Upload to Gallery", icon: Image, color: "bg-pink-500/20 text-pink-400", desc: "Add event photos" },
    { href: "/dashboard/settings", label: "Settings", icon: Settings, color: "bg-gray-500/20 text-gray-400", desc: "Configure platform settings" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Full control over the TechGenz platform.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Members</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {studentCount || 0} students, {coreTeamCount || 0} core team
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents || 0}</div>
            <p className="text-xs text-muted-foreground">Events hosted</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Certificates</CardTitle>
            <Award className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certificatesIssued || 0}</div>
            <p className="text-xs text-muted-foreground">Certificates issued</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Queries</CardTitle>
            <HelpCircle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openQueries || 0}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Actions</CardTitle>
          <CardDescription>Quick access to administrative functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {adminActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-start gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-secondary"
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${action.color}`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{action.label}</h3>
                  <p className="text-sm text-muted-foreground">{action.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Members */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Members</CardTitle>
            <CardDescription>Newest members to join TechGenz</CardDescription>
          </div>
          <Link
            href="/dashboard/members"
            className="text-sm font-medium text-primary hover:underline"
          >
            View All
          </Link>
        </CardHeader>
        <CardContent>
          {recentMembers && recentMembers.length > 0 ? (
            <div className="space-y-4">
              {recentMembers.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-medium text-primary">
                      {m.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{m.name}</p>
                      <p className="text-sm text-muted-foreground">{m.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary">{m.member_id}</p>
                    <p className="text-xs capitalize text-muted-foreground">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">No members yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
