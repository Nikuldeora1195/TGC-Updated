"use client"

import { useEffect, useState } from "react"
import { Bell, Megaphone, Calendar, Info } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Notification {
  id: string
  title: string
  message: string
  notification_type: string
  created_at: string
}

const typeIcons: Record<string, React.ReactNode> = {
  announcement: <Megaphone className="h-5 w-5" />,
  event: <Calendar className="h-5 w-5" />,
  general: <Info className="h-5 w-5" />,
}

const typeColors: Record<string, string> = {
  announcement: "bg-yellow-500/20 text-yellow-400",
  event: "bg-blue-500/20 text-blue-400",
  general: "bg-gray-500/20 text-gray-400",
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNotifications() {
      const supabase = createClient()
      
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })

      setNotifications(data || [])
      setLoading(false)
    }

    fetchNotifications()
  }, [])

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
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Notifications</h1>
        <p className="mt-1 text-muted-foreground">
          Stay updated with community announcements and updates.
        </p>
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${typeColors[notification.notification_type] || typeColors.general}`}>
                      {typeIcons[notification.notification_type] || typeIcons.general}
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
                  <Badge variant="outline" className="capitalize shrink-0">
                    {notification.notification_type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
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
              You&apos;re all caught up! New announcements and updates will appear here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
