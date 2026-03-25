import { LoadingScreen } from "@/components/loading-screen"

export default function Loading() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center">
        <LoadingScreen message="Fetching pages, content, and club updates..." className="w-full" />
      </div>
    </main>
  )
}
