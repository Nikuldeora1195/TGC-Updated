"use client"

import { useEffect, useMemo, useState } from "react"
import { Award, CheckSquare, Code2, Loader2, Plus, RotateCcw } from "lucide-react"
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
import {
  buildCertificateTemplateVariables,
  DEFAULT_CERTIFICATE_TEMPLATE,
  renderCertificateHtml,
} from "@/lib/certificates"

interface EventItem {
  id: string
  title: string
}

interface TemplateItem {
  id: string
  title: string
  event_id: string | null
  template_url: string
  html_content: string | null
}

interface Attendee {
  member_id: string
  members: {
    name: string
    member_id: string
    email: string
  } | null
}

const TEMPLATE_BUCKET = "certificate-templates"

const TEMPLATE_TAGS = [
  "{{name}}",
  "{{recipient_name}}",
  "{{event_title}}",
  "{{certificate_title}}",
  "{{issue_date}}",
  "{{certificate_code}}",
  "{{organization_name}}",
  "{{background_image}}",
]

function getFriendlyTemplateError(message: string) {
  if (message.toLowerCase().includes("bucket")) {
    return `Storage bucket "${TEMPLATE_BUCKET}" is not ready. Create a public Supabase Storage bucket with this name, then try again.`
  }

  return message
}

function buildCertificateCode(eventTitle: string, memberCode: string, index: number) {
  const prefix = eventTitle.replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase() || "CERT"
  return `${prefix}-${memberCode.replace(/[^a-z0-9]/gi, "").toUpperCase()}-${String(index + 1).padStart(3, "0")}`
}

export default function IssueCertificatesPage() {
  const [roleError, setRoleError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [savingTemplate, setSavingTemplate] = useState(false)
  const [issuing, setIssuing] = useState(false)
  const [events, setEvents] = useState<EventItem[]>([])
  const [templates, setTemplates] = useState<TemplateItem[]>([])
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [selectedEventId, setSelectedEventId] = useState("")
  const [selectedTemplateId, setSelectedTemplateId] = useState("")
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([])
  const [templateFile, setTemplateFile] = useState<File | null>(null)
  const [templateForm, setTemplateForm] = useState({
    title: "",
    eventId: "",
    templateUrl: "",
    templateHtml: DEFAULT_CERTIFICATE_TEMPLATE,
  })

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (selectedEventId) {
      fetchAttendees(selectedEventId)
      const eventTemplate = templates.find((template) => template.event_id === selectedEventId)
      if (eventTemplate) {
        setSelectedTemplateId(eventTemplate.id)
      }
    } else {
      setAttendees([])
      setSelectedMemberIds([])
    }
  }, [selectedEventId, templates])

  async function fetchData() {
    setLoading(true)
    setError(null)
    setRoleError(null)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setRoleError("You must be logged in to issue certificates.")
      setLoading(false)
      return
    }

    const { data: member } = await supabase
      .from("members")
      .select("role")
      .eq("id", user.id)
      .single()

    if (member?.role !== "admin") {
      setRoleError("Only admin users can issue certificates.")
      setLoading(false)
      return
    }

    const [
      { data: eventsData, error: eventsError },
      { data: templatesData, error: templatesError },
    ] = await Promise.all([
      supabase.from("events").select("id, title").order("event_date", { ascending: false }),
      supabase.from("certificate_templates").select("id, title, event_id, template_url, html_content").order("created_at", { ascending: false }),
    ])

    if (eventsError || templatesError) {
      setError(eventsError?.message || templatesError?.message || "Failed to load certificate data.")
    } else {
      setEvents(eventsData || [])
      setTemplates((templatesData as TemplateItem[]) || [])
    }

    setLoading(false)
  }

  async function fetchAttendees(eventId: string) {
    const supabase = createClient()

    const { data, error: attendanceError } = await supabase
      .from("event_attendance")
      .select("member_id")
      .eq("event_id", eventId)
      .eq("status", "present")

    if (attendanceError) {
      setError(attendanceError.message)
      setAttendees([])
      setSelectedMemberIds([])
      return
    }

    const memberIds = (data || []).map((row) => row.member_id)
    if (memberIds.length === 0) {
      setAttendees([])
      setSelectedMemberIds([])
      return
    }

    const { data: membersData, error: membersError } = await supabase
      .from("members")
      .select("id, name, member_id, email")
      .in("id", memberIds)

    if (membersError) {
      setError(membersError.message)
      setAttendees([])
      setSelectedMemberIds([])
      return
    }

    const memberMap = new Map((membersData || []).map((member) => [member.id, member]))
    const mergedAttendees = memberIds.map((memberId) => ({
      member_id: memberId,
      members: memberMap.get(memberId) || null,
    }))

    setAttendees(mergedAttendees)
    setSelectedMemberIds(mergedAttendees.map((attendee) => attendee.member_id))
  }

  async function handleCreateTemplate(e: React.FormEvent) {
    e.preventDefault()
    setSavingTemplate(true)
    setError(null)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError("You must be logged in to create templates.")
      setSavingTemplate(false)
      return
    }

    let templateUrl = templateForm.templateUrl.trim()

    if (templateFile) {
      const fileExt = templateFile.name.split(".").pop() || "png"
      const filePath = `${user.id}/certificate-template-${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from(TEMPLATE_BUCKET)
        .upload(filePath, templateFile, { upsert: false })

      if (uploadError) {
        setError(getFriendlyTemplateError(uploadError.message))
        setSavingTemplate(false)
        return
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(TEMPLATE_BUCKET).getPublicUrl(filePath)

      templateUrl = publicUrl
    }

    const { error: insertError } = await supabase.from("certificate_templates").insert({
      title: templateForm.title,
      event_id: templateForm.eventId === "none" || !templateForm.eventId ? null : templateForm.eventId,
      template_url: templateUrl,
      html_content: templateForm.templateHtml.trim() || DEFAULT_CERTIFICATE_TEMPLATE,
      created_by: user.id,
    })

    if (insertError) {
      setError(insertError.message)
      setSavingTemplate(false)
      return
    }

    setTemplateForm({
      title: "",
      eventId: "",
      templateUrl: "",
      templateHtml: DEFAULT_CERTIFICATE_TEMPLATE,
    })
    setTemplateFile(null)
    await fetchData()
    setSavingTemplate(false)
  }

  async function handleIssueCertificates() {
    if (!selectedEventId || !selectedTemplateId || selectedMemberIds.length === 0) return

    setIssuing(true)
    setError(null)

    const supabase = createClient()
    const event = events.find((item) => item.id === selectedEventId)

    if (!event) {
      setError("Selected event could not be found.")
      setIssuing(false)
      return
    }

    const selectedAttendees = attendees.filter((attendee) => selectedMemberIds.includes(attendee.member_id))
    const { data: existingCertificates } = await supabase
      .from("certificates")
      .select("member_id")
      .eq("event_id", selectedEventId)
      .eq("template_id", selectedTemplateId)

    const existingMemberIds = new Set((existingCertificates || []).map((cert) => cert.member_id))
    const rowsToInsert = selectedAttendees
      .filter((attendee) => !existingMemberIds.has(attendee.member_id))
      .map((attendee, index) => ({
        member_id: attendee.member_id,
        event_id: selectedEventId,
        template_id: selectedTemplateId,
        certificate_code: buildCertificateCode(
          event.title,
          attendee.members?.member_id || attendee.member_id.slice(0, 6),
          index
        ),
        recipient_name: attendee.members?.name || "Member",
        title: event.title,
        certificate_url: "dynamic",
      }))

    if (rowsToInsert.length === 0) {
      setError("All selected attendees already have certificates for this template.")
      setIssuing(false)
      return
    }

    const { error: insertError } = await supabase.from("certificates").insert(rowsToInsert)
    if (insertError) {
      setError(insertError.message)
      setIssuing(false)
      return
    }

    setIssuing(false)
  }

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId) || null,
    [templates, selectedTemplateId]
  )

  const previewHtml = useMemo(() => {
    return renderCertificateHtml(
      templateForm.templateHtml,
      buildCertificateTemplateVariables({
        certificateCode: "TECHGE-0001",
        certificateTitle: templateForm.title || "Certificate of Participation",
        eventTitle:
          events.find((event) => event.id === templateForm.eventId)?.title || "Innovation Sprint 2026",
        issuedDate: new Date().toISOString(),
        recipientName: "Alex Johnson",
        backgroundImage: templateForm.templateUrl,
      })
    )
  }, [events, templateForm.eventId, templateForm.templateHtml, templateForm.templateUrl, templateForm.title])

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
        <CardContent className="py-12 text-center text-sm text-muted-foreground">{roleError}</CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Issue Certificates</h1>
        <p className="mt-1 text-muted-foreground">
          Build reusable HTML certificate templates with tags, preview them live on the web, and issue them to present attendees.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Create HTML Certificate Template</CardTitle>
            <CardDescription>
              Use placeholders like <code>{"{{name}}"}</code> and <code>{"{{certificate_code}}"}</code> so every certificate stays perfectly aligned.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateTemplate} className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="template-file">Background Image</Label>
                  <Input
                    id="template-file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setTemplateFile(e.target.files?.[0] || null)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional. Upload a certificate background image and reference it in the HTML with <code>{"{{background_image}}"}</code>.
                  </p>
                </div>

                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="template-url">Background Image URL</Label>
                  <Input
                    id="template-url"
                    type="url"
                    placeholder="https://example.com/certificate-background.png"
                    value={templateForm.templateUrl}
                    onChange={(e) => setTemplateForm({ ...templateForm, templateUrl: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-title">Template Title</Label>
                  <Input
                    id="template-title"
                    value={templateForm.title}
                    onChange={(e) => setTemplateForm({ ...templateForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-event">Event</Label>
                  <Select
                    value={templateForm.eventId}
                    onValueChange={(value) => setTemplateForm({ ...templateForm, eventId: value })}
                  >
                    <SelectTrigger id="template-event">
                      <SelectValue placeholder="Select event" />
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

                <div className="space-y-2 lg:col-span-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="template-html">HTML Template</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setTemplateForm((current) => ({ ...current, templateHtml: DEFAULT_CERTIFICATE_TEMPLATE }))}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset Starter
                    </Button>
                  </div>
                  <Textarea
                    id="template-html"
                    className="min-h-[360px] font-mono text-xs"
                    value={templateForm.templateHtml}
                    onChange={(e) => setTemplateForm({ ...templateForm, templateHtml: e.target.value })}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Code2 className="h-4 w-4 text-primary" />
                  Available Template Tags
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {TEMPLATE_TAGS.map((tag) => (
                    <span key={tag} className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <Button type="submit" disabled={savingTemplate}>
                {savingTemplate ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Template...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Save Template
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>
                This sample preview shows how the tags will render before you issue certificates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Issue to Present Attendees</CardTitle>
              <CardDescription>Issued certificates reuse the selected HTML template for every attendee.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="issue-event">Event</Label>
                <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                  <SelectTrigger id="issue-event">
                    <SelectValue placeholder="Select event" />
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

              <div className="space-y-2">
                <Label htmlFor="issue-template">Template</Label>
                <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                  <SelectTrigger id="issue-template">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTemplate && (
                <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
                  Template selected: <span className="font-medium text-foreground">{selectedTemplate.title}</span>
                  <div className="mt-1">
                    Type: {selectedTemplate.html_content ? "HTML template" : "Legacy image template"}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Present Attendees</Label>
                  {attendees.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedMemberIds(attendees.map((attendee) => attendee.member_id))}
                    >
                      <CheckSquare className="mr-2 h-4 w-4" />
                      Select All
                    </Button>
                  )}
                </div>

                <div className="max-h-72 space-y-3 overflow-y-auto rounded-xl border border-border p-4">
                  {attendees.length > 0 ? (
                    attendees.map((attendee) => (
                      <label key={attendee.member_id} className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedMemberIds.includes(attendee.member_id)}
                          onChange={(e) =>
                            setSelectedMemberIds((current) =>
                              e.target.checked
                                ? [...current, attendee.member_id]
                                : current.filter((id) => id !== attendee.member_id)
                            )
                          }
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {attendee.members?.name || "Member"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {attendee.members?.member_id || attendee.member_id}
                          </p>
                        </div>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Present attendees will appear here after you select an event and mark attendance as present.
                    </p>
                  )}
                </div>
              </div>

              <Button
                onClick={handleIssueCertificates}
                disabled={!selectedEventId || !selectedTemplateId || selectedMemberIds.length === 0 || issuing}
              >
                {issuing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Issuing...
                  </>
                ) : (
                  <>
                    <Award className="mr-2 h-4 w-4" />
                    Issue Certificates
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
