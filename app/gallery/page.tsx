import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { Image as ImageIcon } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"

export default async function GalleryPage() {
  const supabase = await createClient()

  const { data: images } = await supabase
    .from("gallery")
    .select("*, events(title)")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative border-b border-border/50 bg-card/30 py-20">
              <div className="absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-accent/15 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,200,200,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,200,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
          <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Photo Gallery
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Memories from our events, workshops, and community gatherings.
            </p>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {images && images.length > 0 ? (
              <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
                {images.map((image: any) => (
                  <div
                    key={image.id}
                    className="mb-4 break-inside-avoid overflow-hidden rounded-xl border border-border bg-card"
                  >
                    <div className="relative aspect-square bg-secondary">
                      {image.image_url ? (
                        <Image
                          src={image.image_url}
                          alt={image.caption || image.events?.title || "Gallery image"}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/10 to-accent/10">
                          <ImageIcon className="h-16 w-16 text-primary/30" />
                        </div>
                      )}
                    </div>
                    {(image.caption || image.events?.title) && (
                      <div className="p-4">
                        {image.caption && (
                          <p className="text-sm text-foreground">{image.caption}</p>
                        )}
                        {image.events?.title && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {image.events.title}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center py-20 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-foreground">
                    No photos yet
                  </h3>
                  <p className="mt-2 max-w-md text-muted-foreground">
                    Our gallery is empty at the moment. Photos from upcoming events 
                    will be added here. Stay tuned!
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
