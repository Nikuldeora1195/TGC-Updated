"use client"

import { useEffect, useState } from "react"
import { Users, Search, Filter, MoreVertical, Shield, UserCheck, UserX } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Member {
  id: string
  member_id: string
  name: string
  email: string
  role: string
  year: string | null
  joined_at: string
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  useEffect(() => {
    fetchMembers()
  }, [])

  useEffect(() => {
    let filtered = members

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (m) =>
          m.name?.toLowerCase().includes(searchLower) ||
          m.email?.toLowerCase().includes(searchLower) ||
          m.member_id?.toLowerCase().includes(searchLower)
      )
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((m) => m.role === roleFilter)
    }

    setFilteredMembers(filtered)
  }, [search, roleFilter, members])

  async function fetchMembers() {
    const supabase = createClient()
    const { data } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false })

    setMembers(data || [])
    setFilteredMembers(data || [])
    setLoading(false)
  }

  async function updateRole(memberId: string, newRole: string) {
    const supabase = createClient()
    await supabase
      .from("members")
      .update({ role: newRole })
      .eq("id", memberId)

    setMembers(
      members.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    )
  }

  const roleColors: Record<string, string> = {
    student: "bg-blue-500/20 text-blue-400",
    core_team: "bg-green-500/20 text-green-400",
    admin: "bg-purple-500/20 text-purple-400",
  }

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
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Members</h1>
        <p className="mt-1 text-muted-foreground">
          View and manage all TechGenz members.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="core_team">Core Team</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Members ({filteredMembers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 text-sm font-medium text-muted-foreground">Member</th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">Member ID</th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">Role</th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">Joined</th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b border-border/50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-medium text-primary">
                          {member.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <code className="rounded bg-muted px-2 py-1 text-sm">
                        {member.member_id}
                      </code>
                    </td>
                    <td className="py-4">
                      <Badge className={roleColors[member.role]}>
                        {member.role === "core_team" ? "Core Team" : member.role}
                      </Badge>
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">
                      {new Date(member.joined_at).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => updateRole(member.id, "student")}>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Set as Student
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateRole(member.id, "core_team")}>
                            <Shield className="mr-2 h-4 w-4" />
                            Set as Core Team
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateRole(member.id, "admin")}>
                            <Shield className="mr-2 h-4 w-4" />
                            Set as Admin
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMembers.length === 0 && (
            <div className="py-10 text-center text-muted-foreground">
              No members found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
