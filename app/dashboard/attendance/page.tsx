"use client"

import { useEffect, useMemo, useState } from "react"
import { CheckCircle2, Clock, Search, UserX, Users } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Member {
  id: string
  name: string
  member_id: string
  email: string
  role: string
}

interface EventItem {
  id: string
  title: string
  event_date: string
}

interface AttendanceRow {
  id: string
  event_id: string
  member_id: string
  status: string
  created_at: string
}

export default function AttendancePage() {
  const [loading, setLoading] = useState(true)
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [role, setRole] = useState<"student" | "core_team" | "admin">("student")
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [events, setEvents] = useState<EventItem[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [attendanceRows, setAttendanceRows] = useState<AttendanceRow[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>("")
  const [search, setSearch] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError("You must be logged in to view attendance.")
      setLoading(false)
      return
    }

    setCurrentUserId(user.id)

    const { data: currentMember, error: currentMemberError } = await supabase
      .from("members")
      .select("role")
      .eq("id", user.id)
      .single()

    if (currentMemberError) {
      setError(currentMemberError.message)
      setLoading(false)
      return
    }

    const currentRole = (currentMember?.role || "student") as "student" | "core_team" | "admin"
    setRole(currentRole)

    if (currentRole === "student") {
      const [{ data: ownAttendance, error: attendanceError }, { data: eventsData, error: eventsError }] =
        await Promise.all([
          supabase
            .from("event_attendance")
            .select("*")
            .eq("member_id", user.id)
            .order("created_at", { ascending: false }),
          supabase.from("events").select("id, title, event_date").order("event_date", { ascending: false }),
        ])

      if (attendanceError || eventsError) {
        setError(attendanceError?.message || eventsError?.message || "Failed to load attendance.")
      } else {
        setAttendanceRows(ownAttendance || [])
        setEvents(eventsData || [])
      }

      setLoading(false)
      return
    }

    const [
      { data: eventsData, error: eventsError },
      { data: membersData, error: membersError },
      { data: attendanceData, error: attendanceError },
    ] = await Promise.all([
      supabase.from("events").select("id, title, event_date").order("event_date", { ascending: false }),
      supabase.from("members").select("id, name, member_id, email, role").order("name", { ascending: true }),
      supabase.from("event_attendance").select("*").order("created_at", { ascending: false }),
    ])

    if (eventsError || membersError || attendanceError) {
      setError(
        eventsError?.message ||
          membersError?.message ||
          attendanceError?.message ||
          "Failed to load attendance data."
      )
    } else {
      setEvents(eventsData || [])
      setMembers(membersData || [])
      setAttendanceRows(attendanceData || [])
      if ((eventsData || []).length > 0) {
        setSelectedEventId((eventsData || [])[0].id)
      }
    }

    setLoading(false)
  }

  async function markAttendance(memberId: string, status: "present" | "absent") {
    if (!selectedEventId) return

    const key = `${selectedEventId}-${memberId}`
    setSavingKey(key)
    setError(null)

    const supabase = createClient()
    const existingRow = attendanceRows.find(
      (row) => row.event_id === selectedEventId && row.member_id === memberId
    )

    if (existingRow) {
      const { error: updateError } = await supabase
        .from("event_attendance")
        .update({ status })
        .eq("event_id", selectedEventId)
        .eq("member_id", memberId)

      if (updateError) {
        setError(updateError.message)
        setSavingKey(null)
        return
      }

      setAttendanceRows((current) =>
        current.map((row) =>
          row.event_id === selectedEventId && row.member_id === memberId ? { ...row, status } : row
        )
      )
    } else {
      const { data: insertedRows, error: insertError } = await supabase
        .from("event_attendance")
        .insert({
          event_id: selectedEventId,
          member_id: memberId,
          status,
        })
        .select("*")

      if (insertError) {
        setError(insertError.message)
        setSavingKey(null)
        return
      }

      if (insertedRows && insertedRows.length > 0) {
        setAttendanceRows((current) => [insertedRows[0] as AttendanceRow, ...current])
      }
    }

    setSavingKey(null)
  }

  const eventMap = useMemo(
    () => Object.fromEntries(events.map((event) => [event.id, event])),
    [events]
  )

  const selectedEventAttendance = useMemo(
    () => attendanceRows.filter((row) => row.event_id === selectedEventId),
    [attendanceRows, selectedEventId]
  )

  const filteredMembers = useMemo(() => {
    const baseMembers = members.filter((member) =>
      `${member.name} ${member.email} ${member.member_id}`.toLowerCase().includes(search.toLowerCase())
    )

    return baseMembers
  }, [members, search])

  const memberAttendanceSummary = useMemo(() => {
    const counts = new Map<string, { present: number; absent: number }>()

    attendanceRows.forEach((row) => {
      if (!counts.has(row.member_id)) {
        counts.set(row.member_id, { present: 0, absent: 0 })
      }

      const entry = counts.get(row.member_id)!
      if (row.status === "present") entry.present += 1
      if (row.status === "absent") entry.absent += 1
    })

    return counts
  }, [attendanceRows])

  const ownAttendanceCount = attendanceRows.filter((row) => row.status === "present").length
  const ownAbsentCount = attendanceRows.filter((row) => row.status === "absent").length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (error && !events.length && role === "student" && attendanceRows.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">{error}</CardContent>
      </Card>
    )
  }

  if (role === "student") {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Attendance</h1>
          <p className="mt-1 text-muted-foreground">
            Track your attendance status for each event and your overall attendance count.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Present Count</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ownAttendanceCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Absent Count</CardTitle>
              <UserX className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ownAbsentCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Marked Events</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceRows.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Attendance by Event</CardTitle>
            <CardDescription>See whether you were marked present or absent for each event.</CardDescription>
          </CardHeader>
          <CardContent>
            {attendanceRows.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-3 text-sm font-medium text-muted-foreground">Event</th>
                      <th className="pb-3 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="pb-3 text-sm font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRows.map((row) => (
                      <tr key={row.id} className="border-b border-border/50">
                        <td className="py-4 text-sm font-medium text-foreground">
                          {eventMap[row.event_id]?.title || "Unknown Event"}
                        </td>
                        <td className="py-4 text-sm text-muted-foreground">
                          {eventMap[row.event_id]?.event_date
                            ? new Date(eventMap[row.event_id].event_date).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="py-4">
                          <Badge
                            className={
                              row.status === "present"
                                ? "bg-green-500/20 text-green-400"
                                : row.status === "absent"
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-secondary text-secondary-foreground"
                            }
                          >
                            {row.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-10 text-center text-muted-foreground">
                No attendance has been marked for you yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Attendance Management</h1>
        <p className="mt-1 text-muted-foreground">
          Mark members present or absent for events and review attendance counts across the community.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Mark Attendance</CardTitle>
            <CardDescription>Select an event and mark members present or absent.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-[1fr_320px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search members by name, email, or member ID"
                  className="pl-9"
                />
              </div>

              <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an event" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedEventId ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-3 text-sm font-medium text-muted-foreground">Member</th>
                      <th className="pb-3 text-sm font-medium text-muted-foreground">Member ID</th>
                      <th className="pb-3 text-sm font-medium text-muted-foreground">Current Status</th>
                      <th className="pb-3 text-sm font-medium text-muted-foreground">Mark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member) => {
                      const row = selectedEventAttendance.find((item) => item.member_id === member.id)
                      const currentStatus = row?.status || "not marked"
                      const actionKey = `${selectedEventId}-${member.id}`

                      return (
                        <tr key={member.id} className="border-b border-border/50">
                          <td className="py-4">
                            <div>
                              <p className="font-medium text-foreground">{member.name}</p>
                              <p className="text-sm text-muted-foreground">{member.email}</p>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-muted-foreground">{member.member_id}</td>
                          <td className="py-4">
                            <Badge
                              className={
                                currentStatus === "present"
                                  ? "bg-green-500/20 text-green-400"
                                  : currentStatus === "absent"
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-secondary text-secondary-foreground"
                              }
                            >
                              {currentStatus}
                            </Badge>
                          </td>
                          <td className="py-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markAttendance(member.id, "present")}
                                disabled={savingKey === actionKey}
                              >
                                Present
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => markAttendance(member.id, "absent")}
                                disabled={savingKey === actionKey}
                              >
                                Absent
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-10 text-center text-muted-foreground">Select an event to begin marking attendance.</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Event Summary</CardTitle>
            <CardDescription>Counts for the selected event.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Present</p>
              <p className="mt-1 text-2xl font-bold">
                {selectedEventAttendance.filter((row) => row.status === "present").length}
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Absent</p>
              <p className="mt-1 text-2xl font-bold">
                {selectedEventAttendance.filter((row) => row.status === "absent").length}
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Total Marked</p>
              <p className="mt-1 text-2xl font-bold">{selectedEventAttendance.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Count by Member</CardTitle>
          <CardDescription>Admin and core team overview of present and absent counts for all members.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 text-sm font-medium text-muted-foreground">Member</th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">Member ID</th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">Present Count</th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">Absent Count</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => {
                  const summary = memberAttendanceSummary.get(member.id) || { present: 0, absent: 0 }

                  return (
                    <tr key={member.id} className="border-b border-border/50">
                      <td className="py-4 text-sm font-medium text-foreground">{member.name}</td>
                      <td className="py-4 text-sm text-muted-foreground">{member.member_id}</td>
                      <td className="py-4 text-sm text-foreground">{summary.present}</td>
                      <td className="py-4 text-sm text-foreground">{summary.absent}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
