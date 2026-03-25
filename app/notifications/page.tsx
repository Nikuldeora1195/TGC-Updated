import { Bell, Calendar, Info, Megaphone } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const typeIcons = {
  announcement: <Megaphone className="h-5 w-5" />,
  event: <Calendar className="h-5 w-5" />,
  general: <Info className="h-5 w-5" />,
}

const typeColors = {
  announcement: "bg-yellow-500/20 text-yellow-400",
  event: "bg-blue-500/20 text-blue-400",
  general: "bg-gray-500/20 text-gray-400",
}

export default async function PublicNotificationsPage() {
  const supabase = await createClient()

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        <section className="relative border-b border-border/50 bg-card/30 py-20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,200,200,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,200,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
          <div className="absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-accent/15 blur-3xl" />

          <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Notifications
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Stay updated with the latest announcements and community updates from TechGenz.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            {notifications && notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <Card key={notification.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${typeColors[notification.notification_type as keyof typeof typeColors] || typeColors.general}`}>
                            {typeIcons[notification.notification_type as keyof typeof typeIcons] || typeIcons.general}
                          </div>
                          <div>
                            <CardTitle className="text-base">{notification.title}</CardTitle>
                            <CardDescription className="mt-1">
                              {new Date(notification.created_at).toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline" className="shrink-0 capitalize">
                          {notification.notification_type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center py-16 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                    <Bell className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">No notifications</h3>
                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    There are no public notifications at the moment.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
