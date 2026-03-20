"use client"

import { useEffect, useState } from "react"
import { Image as ImageIcon, Loader2, Plus, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface EventItem {
  id: string
  title: string
}

interface GalleryItem {
  id: string
  image_url: string
  caption: string | null
  event_id: string | null
  uploaded_by: string | null
  created_at: string
  events: {
    title: string
  } | null
}

export default function DashboardGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [roleError, setRoleError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    imageUrl: "",
    caption: "",
    eventId: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    setError(null)
    setRoleError(null)

    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setRoleError("You must be logged in to access gallery management.")
      setLoading(false)
      return
    }

    const { data: member } = await supabase
      .from("members")
      .select("role")
      .eq("id", user.id)
      .single()

    if (member?.role !== "core_team" && member?.role !== "admin") {
      setRoleError("Only core team and admin members can manage the gallery.")
      setLoading(false)
      return
    }

    const [{ data: galleryData, error: galleryError }, { data: eventsData, error: eventsError }] =
      await Promise.all([
        supabase
          .from("gallery")
          .select("id, image_url, caption, event_id, uploaded_by, created_at, events(title)")
          .order("created_at", { ascending: false }),
        supabase.from("events").select("id, title").order("event_date", { ascending: false }),
      ])

    if (galleryError || eventsError) {
      setError(galleryError?.message || eventsError?.message || "Failed to load gallery data.")
    } else {
      setItems((galleryData as GalleryItem[]) || [])
      setEvents(eventsData || [])
    }

    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError("You must be logged in to upload images.")
      setSubmitting(false)
      return
    }

    const { error: insertError } = await supabase.from("gallery").insert({
      image_url: formData.imageUrl,
      caption: formData.caption || null,
      event_id: formData.eventId === "none" || !formData.eventId ? null : formData.eventId,
      uploaded_by: user.id,
    })

    if (insertError) {
      setError(insertError.message)
      setSubmitting(false)
      return
    }

    setFormData({
      imageUrl: "",
      caption: "",
      eventId: "",
    })

    await fetchData()
    setSubmitting(false)
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    setError(null)

    const supabase = createClient()
    const { error: deleteError } = await supabase.from("gallery").delete().eq("id", id)

    if (deleteError) {
      setError(deleteError.message)
      setDeletingId(null)
      return
    }

    setItems((current) => current.filter((item) => item.id !== id))
    setDeletingId(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (roleError) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-sm text-muted-foreground">{roleError}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Gallery Management</h1>
        <p className="mt-1 text-muted-foreground">
          Upload and manage event images for the public gallery.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Gallery Image</CardTitle>
          <CardDescription>Save a new image entry to the gallery table.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  type="url"
                  placeholder="https://example.com/event-photo.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event">Event</Label>
                <Select
                  value={formData.eventId}
                  onValueChange={(value) => setFormData({ ...formData, eventId: value })}
                >
                  <SelectTrigger id="event">
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No event</SelectItem>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="caption">Caption</Label>
                <Textarea
                  id="caption"
                  placeholder="Add a short caption for this image"
                  rows={4}
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                />
              </div>
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Image
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gallery Images</CardTitle>
          <CardDescription>
            Manage uploaded images shown on the public <code>/gallery</code> page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {items.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-xl border border-border bg-card"
                >
                  <div className="aspect-[4/3] bg-muted">
                    <img
                      src={item.image_url}
                      alt={item.caption || item.events?.title || "Gallery image"}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="space-y-3 p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {item.caption || "Untitled image"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.events?.title || "No event linked"}
                      </p>
                    </div>

                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>Uploaded: {new Date(item.created_at).toLocaleDateString()}</p>
                      {item.uploaded_by && <p>Uploaded by: {item.uploaded_by}</p>}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" asChild className="flex-1">
                        <a href={item.image_url} target="_blank" rel="noopener noreferrer">
                          View Image
                        </a>
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                      >
                        {deletingId === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">No gallery images yet</h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Add your first event image using the form above.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
