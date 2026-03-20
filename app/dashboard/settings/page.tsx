import Link from "next/link"
import { redirect } from "next/navigation"
import { Settings, Users } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: member } = await supabase
    .from("members")
    .select("role")
    .eq("id", user.id)
    .single()

  if (member?.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Configure admin-managed sections of the TechGenz platform.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/settings/team">
          <Card className="h-full transition-colors hover:bg-secondary">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mt-4">Team Management</CardTitle>
              <CardDescription>
                Manage founders, current positions, and previous batch teams.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Update the public team page and homepage team preview.
            </CardContent>
          </Card>
        </Link>

        <Card className="border-dashed">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Settings className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle className="mt-4">More Settings</CardTitle>
            <CardDescription>
              This area is ready for future admin configuration pages.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
