import { LoadingScreen } from "@/components/loading-screen"

export default function DashboardLoading() {
  return (
    <div className="p-4 pt-20 lg:p-8 lg:pt-8">
      <LoadingScreen
        message="Loading dashboard data, permissions, and live activity..."
        className="min-h-[calc(100vh-8rem)]"
      />
    </div>
  )
}
