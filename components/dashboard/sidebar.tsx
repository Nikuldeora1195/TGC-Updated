"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Calendar,
  Award,
  Bell,
  HelpCircle,
  Image as ImageIcon,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { BrandMark } from "@/components/brand-mark"

interface SidebarProps {
  role: "student" | "core_team" | "admin"
  userName: string
  memberId: string
}

const studentLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/events", label: "Events", icon: Calendar },
  { href: "/dashboard/attendance", label: "Attendance", icon: Users },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/help", label: "Help Desk", icon: HelpCircle },
]

const coreTeamLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/events", label: "Manage Events", icon: Calendar },
  { href: "/dashboard/attendance", label: "Attendance", icon: Users },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/queries", label: "Queries", icon: HelpCircle },
]

const adminLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/members", label: "Members", icon: Users },
  { href: "/dashboard/events", label: "Events", icon: Calendar },
  { href: "/dashboard/attendance", label: "Attendance", icon: Users },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/queries", label: "Queries", icon: HelpCircle },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export function DashboardSidebar({ role, userName, memberId }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = role === "admin" ? adminLinks : role === "core_team" ? coreTeamLinks : studentLinks

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        <Link href="/" className="flex items-center">
          <BrandMark
            showText={!collapsed}
            iconClassName="h-8 w-8 rounded-lg"
            textClassName="h-8"
          />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="flex flex-col gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <link.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{link.label}</span>}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="border-t border-sidebar-border p-4">
        <div className={cn("mb-3 flex items-center gap-3", collapsed && "justify-center")}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground">
            {userName.charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-sidebar-foreground">{userName}</p>
              <p className="truncate text-xs text-sidebar-foreground/60">{memberId}</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          className={cn("w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground", collapsed && "justify-center px-0")}
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Sign out</span>}
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-full flex-col bg-sidebar transition-all duration-300 lg:relative",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
