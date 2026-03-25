import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, Clock, Image as ImageIcon, MapPin, Users } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface EventDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EventDetailsPage({ params }: EventDetailsPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .single()

  if (!event) {
    notFound()
  }

  const { data: images } = await supabase
    .from("gallery")
    .select("id, image_url, caption, created_at")
    .eq("event_id", id)
    .order("created_at", { ascending: false })

  const galleryImages = images || []

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        <section className="relative border-b border-border/50 bg-card/30 py-20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,200,200,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,200,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
          <div className="absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-accent/15 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <Badge variant="secondary" className="capitalize">
                {event.event_type}
              </Badge>
              <h1 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
                {event.title}
              </h1>
              <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
                {event.description || "No description has been added for this event yet."}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="outline" asChild>
                  <Link href="/events">Back to Events</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/login">Register Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
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
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
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
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    Location
                  </div>
                  <p className="mt-2 font-medium text-foreground">{event.location || "TBA"}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4 text-primary" />
                    Capacity
                  </div>
                  <p className="mt-2 font-medium text-foreground">
                    {event.max_attendees ? `${event.max_attendees} attendees max` : "Unlimited"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="border-t border-border/50 bg-card/30 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground">About This Event</h2>
              <p className="mt-4 whitespace-pre-wrap text-muted-foreground">
                {event.description || "No additional event details are available yet."}
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Event Images</h2>
                <p className="mt-2 text-muted-foreground">
                  Photos attached to this event in the gallery.
                </p>
              </div>
            </div>

            {galleryImages.length > 0 ? (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {galleryImages.map((image: any) => (
                  <Card key={image.id} className="overflow-hidden">
                    <div className="relative aspect-[4/3] bg-secondary">
                      {image.image_url ? (
                        <Image
                          src={image.image_url}
                          alt={image.caption || event.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/10 to-accent/10">
                          <ImageIcon className="h-12 w-12 text-primary/30" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <p className="text-sm text-foreground line-clamp-2">
                        {image.caption || "Event photo"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>No images yet</CardTitle>
                  <CardDescription>
                    Photos for this event have not been added to the gallery yet.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
