import { notFound, redirect } from "next/navigation"
import { Download, MapPin, Calendar, Users, Tag, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface EventPageProps {
  params: Promise<{
    id: string
  }>
}

function escapeCsv(value: string | null | undefined) {
  const stringValue = value ?? ""
  return `"${stringValue.replace(/"/g, '""')}"`
}

export default async function EventDetailsPage({ params }: EventPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: member } = await supabase
    .from("members")
    .select("role")
    .eq("id", user.id)
    .single()

  if (member?.role !== "core_team" && member?.role !== "admin") {
    redirect("/dashboard")
  }

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single()

  if (!event) {
    notFound()
  }

  const { data: attendees } = await supabase
    .from("event_attendance")
    .select("status, created_at, members(name, member_id)")
    .eq("event_id", id)
    .order("created_at", { ascending: true })

  const attendeeRows =
    attendees?.map((attendee: any) => ({
      name: attendee.members?.name || "Unknown",
      memberId: attendee.members?.member_id || "N/A",
      status: attendee.status || "registered",
    })) || []

  const csvRows = [
    ["Member Name", "Member ID", "Status"],
    ...attendeeRows.map((row) => [row.name, row.memberId, row.status]),
  ]

  const csvContent = csvRows.map((row) => row.map((cell) => escapeCsv(cell)).join(",")).join("\n")
  const csvHref = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`
  const attendeeCount = attendeeRows.length

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">{event.title}</h1>
          <p className="mt-1 text-muted-foreground">
            Event details and registered attendees.
          </p>
        </div>

        <Button asChild>
          <a href={csvHref} download={`event-attendees-${id}.csv`}>
            <Download className="mr-2 h-4 w-4" />
            Export Attendees CSV
          </a>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Information</CardTitle>
          <CardDescription>Overview of this event and registration details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                Date
              </div>
              <p className="mt-2 font-medium text-foreground">
                {new Date(event.event_date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                Time
              </div>
              <p className="mt-2 font-medium text-foreground">
                {new Date(event.event_date).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                Location
              </div>
              <p className="mt-2 font-medium text-foreground">{event.location || "TBA"}</p>
            </div>

            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="h-4 w-4 text-primary" />
                Event Type
              </div>
              <div className="mt-2">
                <Badge variant="secondary" className="capitalize">
                  {event.event_type || "general"}
                </Badge>
              </div>
            </div>

            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 text-primary" />
                Capacity
              </div>
              <p className="mt-2 font-medium text-foreground">
                {event.max_attendees ? `${attendeeCount} / ${event.max_attendees}` : `${attendeeCount} registered`}
              </p>
            </div>

            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 text-primary" />
                Published
              </div>
              <p className="mt-2 font-medium text-foreground">{event.is_published ? "Yes" : "No"}</p>
            </div>
          </div>

          <div className="rounded-lg border border-border p-4">
            <h2 className="text-sm font-medium text-muted-foreground">Description</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">
              {event.description || "No description provided for this event."}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registered Members</CardTitle>
          <CardDescription>
            {attendeeCount} attendee{attendeeCount === 1 ? "" : "s"} currently registered.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {attendeeRows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Member Name</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Member ID</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendeeRows.map((attendee, index) => (
                    <tr key={`${attendee.memberId}-${index}`} className="border-b border-border/50">
                      <td className="py-4 text-sm text-foreground">{attendee.name}</td>
                      <td className="py-4 text-sm text-muted-foreground">{attendee.memberId}</td>
                      <td className="py-4">
                        <Badge variant="outline" className="capitalize">
                          {attendee.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-10 text-center text-muted-foreground">
              No registered members yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
