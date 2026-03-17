import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch member data
  const { data: member } = await supabase
    .from("members")
    .select("*")
    .eq("id", user.id)
    .single()

  const role = (member?.role as "student" | "core_team" | "admin") || "student"
  const userName = member?.name || user.email?.split("@")[0] || "User"
  const memberId = member?.member_id || "TG-XXXX-XXXX"

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role={role} userName={userName} memberId={memberId} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
