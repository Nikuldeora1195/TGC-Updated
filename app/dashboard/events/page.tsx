"use client"

import { useEffect, useState } from "react"
import { Calendar, MapPin, Users, Clock, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Event {
  id: string
  title: string
  description: string
  event_date: string
  location: string
  event_type: string
  max_attendees: number | null
  is_published: boolean
}

interface Attendance {
  event_id: string
  status: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      
      const { data: eventsData } = await supabase
        .from("events")
        .select("*")
        .eq("is_published", true)
        .order("event_date", { ascending: true })

      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: attendanceData } = await supabase
          .from("event_attendance")
          .select("event_id, status")
          .eq("member_id", user.id)

        setAttendance(attendanceData || [])
      }

      setEvents(eventsData || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  async function handleRegister(eventId: string) {
    setRegistering(eventId)
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from("event_attendance").insert({
      event_id: eventId,
      member_id: user.id,
      status: "registered",
    })

    if (!error) {
      setAttendance([...attendance, { event_id: eventId, status: "registered" }])
    }
    
    setRegistering(null)
  }

  const isRegistered = (eventId: string) => 
    attendance.some((a) => a.event_id === eventId)

  const upcomingEvents = events.filter(
    (e) => new Date(e.event_date) >= new Date()
  )
  const pastEvents = events.filter(
    (e) => new Date(e.event_date) < new Date()
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Events</h1>
        <p className="mt-1 text-muted-foreground">
          Discover and register for upcoming community events.
        </p>
      </div>

      {/* Upcoming Events */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Upcoming Events</h2>
        {upcomingEvents.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {event.event_type}
                    </Badge>
                    {isRegistered(event.id) && (
                      <Badge className="bg-green-500/20 text-green-400">
                        <Check className="mr-1 h-3 w-3" /> Registered
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="mt-2 line-clamp-2">{event.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    {new Date(event.event_date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    {new Date(event.event_date).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    {event.location || "TBA"}
                  </div>
                  {event.max_attendees && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4 text-primary" />
                      Max {event.max_attendees} attendees
                    </div>
                  )}
                  <div className="mt-4 flex gap-3">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href={`/dashboard/events/${event.id}`}>View Details</Link>
                    </Button>
                    {!isRegistered(event.id) ? (
                      <Button
                        className="flex-1"
                        onClick={() => handleRegister(event.id)}
                        disabled={registering === event.id}
                      >
                        {registering === event.id ? "Registering..." : "Register Now"}
                      </Button>
                    ) : (
                      <Button className="flex-1" disabled>
                        Registered
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No upcoming events at the moment. Check back soon!
            </CardContent>
          </Card>
        )}
      </section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Past Events</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event) => (
              <Card key={event.id} className="opacity-60">
                <CardHeader>
                  <Badge variant="outline" className="w-fit capitalize">
                    {event.event_type}
                  </Badge>
                  <CardTitle className="mt-2 line-clamp-2">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(event.event_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <Button variant="outline" className="mt-4 w-full" asChild>
                    <Link href={`/dashboard/events/${event.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
