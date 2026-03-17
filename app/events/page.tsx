import { createClient } from "@/lib/supabase/server"
import { Calendar, MapPin, Clock, Users } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function EventsPage() {
  const supabase = await createClient()

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .order("event_date", { ascending: true })

  const upcomingEvents = events?.filter(
    (e) => new Date(e.event_date) >= new Date()
  ) || []
  
  const pastEvents = events?.filter(
    (e) => new Date(e.event_date) < new Date()
  ) || []

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative border-b border-border/50 bg-card/30 py-20">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,200,200,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,200,0.08)_1px,transparent_1px)] bg-size-[64px_64px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,200,200,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,200,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
       <div className="absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-accent/15 blur-3xl" />


          <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Community Events
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Discover workshops, hackathons, seminars, and meetups organized by TechGenz.
            </p>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-16">
      <div className="absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-accent/15 blur-3xl" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground">Upcoming Events</h2>
            <p className="mt-2 text-muted-foreground">Don&apos;t miss out on these exciting opportunities</p>

            {upcomingEvents.length > 0 ? (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <Card key={event.id} className="group relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Badge variant="secondary" className="capitalize">
                          {event.event_type}
                        </Badge>
                      </div>
                      <CardTitle className="mt-3 line-clamp-2">{event.title}</CardTitle>
                      <CardDescription className="line-clamp-3">
                        {event.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 text-primary" />
                        {new Date(event.event_date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
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
                      {event.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 text-primary" />
                          {event.location}
                        </div>
                      )}
                      {event.max_attendees && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4 text-primary" />
                          Limited to {event.max_attendees} attendees
                        </div>
                      )}
                      <Button className="mt-4 w-full" asChild>
                        <Link href="/auth/login">Register Now</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="mt-8">
                <CardContent className="flex flex-col items-center py-16 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 font-semibold text-foreground">No upcoming events</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Check back soon for new events or follow us on social media for updates.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <section className="border-t border-border/50 bg-card/30 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-foreground">Past Events</h2>
              <p className="mt-2 text-muted-foreground">A look back at our previous events</p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {pastEvents.map((event) => (
                  <Card key={event.id} className="opacity-70">
                    <CardHeader className="pb-3">
                      <Badge variant="outline" className="w-fit capitalize">
                        {event.event_type}
                      </Badge>
                      <CardTitle className="mt-2 text-base line-clamp-2">{event.title}</CardTitle>
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
