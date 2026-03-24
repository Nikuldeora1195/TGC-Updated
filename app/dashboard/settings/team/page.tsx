"use client"

import { useEffect, useState } from "react"
import { Loader2, Pencil, Plus, Trash2, Users } from "lucide-react"
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
import { Switch } from "@/components/ui/switch"

interface TeamMember {
  id: string
  name: string
  display_role: string
  section: string
  batch_label: string | null
  bio: string | null
  image_url: string | null
  linkedin_url: string | null
  github_url: string | null
  email: string | null
  sort_order: number
  is_active: boolean
}

const sectionLabels: Record<string, string> = {
  founder: "Founder",
  co_founder: "Co-Founder",
  current_team: "Current Team",
  vice_captain: "Vice Captains",
  jr_captain: "Junior Captains",
  previous_batch: "Previous Batch",
}

const batchOptions = [
  "2025-26 Team",
  "2024-25 Team",
  "2023-24 Team",
  "2022-23 Team",
  "2021-22 Team",
  "Custom",
]

const TEAM_BUCKET = "team-images"
const MAX_IMAGE_SIZE_BYTES = 500 * 1024

function getFriendlyTeamTableError(message: string) {
  if (
    message.includes("schema cache") ||
    message.includes("Could not find the table") ||
    message.includes("relation") ||
    message.includes("team_members")
  ) {
    return "Team table is not ready yet. Run scripts/004_create_team_members.sql in Supabase SQL Editor, then refresh this page."
  }

  return message
}

function getFriendlyTeamStorageError(message: string) {
  if (message.toLowerCase().includes("bucket")) {
    return `Storage bucket "${TEAM_BUCKET}" is not ready. Create a public Supabase Storage bucket with this name, then try again.`
  }

  return message
}

export default function TeamSettingsPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [roleError, setRoleError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    displayRole: "",
    section: "",
    batchLabel: "",
    customBatchLabel: "",
    bio: "",
    imageUrl: "",
    linkedinUrl: "",
    githubUrl: "",
    email: "",
    sortOrder: "0",
    isActive: true,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [removeExistingImage, setRemoveExistingImage] = useState(false)

  useEffect(() => {
    fetchMembers()
  }, [])

  function resetForm() {
    setFormData({
      name: "",
      displayRole: "",
      section: "",
      batchLabel: "",
      customBatchLabel: "",
      bio: "",
      imageUrl: "",
      linkedinUrl: "",
      githubUrl: "",
      email: "",
      sortOrder: "0",
      isActive: true,
    })
    setImageFile(null)
    setRemoveExistingImage(false)
    setEditingId(null)
  }

  function startEditing(member: TeamMember) {
    setEditingId(member.id)
    setImageFile(null)
    setRemoveExistingImage(false)
    setError(null)
    setFormData({
      name: member.name,
      displayRole: member.display_role,
      section: member.section,
      batchLabel: batchOptions.includes(member.batch_label || "") ? member.batch_label || "" : member.batch_label ? "Custom" : "",
      customBatchLabel:
        member.batch_label && !batchOptions.includes(member.batch_label) ? member.batch_label : "",
      bio: member.bio || "",
      imageUrl: member.image_url || "",
      linkedinUrl: member.linkedin_url || "",
      githubUrl: member.github_url || "",
      email: member.email || "",
      sortOrder: String(member.sort_order ?? 0),
      isActive: member.is_active,
    })
  }

  function handleImageFileChange(file: File | null) {
    if (!file) {
      setImageFile(null)
      return
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setImageFile(null)
      setError("Profile photo must be smaller than 500 KB. Please compress it or use an image link instead.")
      return
    }

    setError(null)
    setRemoveExistingImage(false)
    setImageFile(file)
  }

  async function fetchMembers() {
    setLoading(true)
    setError(null)
    setRoleError(null)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setRoleError("You must be logged in to manage team members.")
      setLoading(false)
      return
    }

    const { data: member } = await supabase
      .from("members")
      .select("role")
      .eq("id", user.id)
      .single()

    if (member?.role !== "admin") {
      setRoleError("Only admin users can manage the team page.")
      setLoading(false)
      return
    }

    const { data, error: teamError } = await supabase
      .from("team_members")
      .select("*")
      .order("section", { ascending: true })
      .order("sort_order", { ascending: true })

    if (teamError) {
      setError(getFriendlyTeamTableError(teamError.message))
    } else {
      setMembers(data || [])
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
      setError("You must be logged in to add team members.")
      setSubmitting(false)
      return
    }

    if (imageFile && imageFile.size > MAX_IMAGE_SIZE_BYTES) {
      setError("Profile photo must be smaller than 500 KB. Please compress it or use an image link instead.")
      setSubmitting(false)
      return
    }

    let imageUrl = removeExistingImage ? "" : formData.imageUrl.trim()

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop() || "jpg"
      const filePath = `${user.id}/team-${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from(TEAM_BUCKET)
        .upload(filePath, imageFile, { upsert: false })

      if (uploadError) {
        setError(getFriendlyTeamStorageError(uploadError.message))
        setSubmitting(false)
        return
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(TEAM_BUCKET).getPublicUrl(filePath)

      imageUrl = publicUrl
    }

    const payload = {
      name: formData.name.trim(),
      display_role: formData.displayRole.trim(),
      section: formData.section,
      batch_label:
        formData.section === "previous_batch"
          ? formData.batchLabel === "Custom"
            ? formData.customBatchLabel.trim() || null
            : formData.batchLabel || null
          : null,
      bio: formData.bio.trim() || null,
      image_url: imageUrl || null,
      linkedin_url: formData.linkedinUrl.trim() || null,
      github_url: formData.githubUrl.trim() || null,
      email: formData.email.trim() || null,
      sort_order: Number(formData.sortOrder) || 0,
      is_active: formData.isActive,
    }

    const query = editingId
      ? supabase.from("team_members").update(payload).eq("id", editingId)
      : supabase.from("team_members").insert({
          ...payload,
          created_by: user.id,
        })

    const { error: saveError } = await query

    if (saveError) {
      setError(getFriendlyTeamTableError(saveError.message))
      setSubmitting(false)
      return
    }

    resetForm()
    await fetchMembers()
    setSubmitting(false)
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    setError(null)

    const supabase = createClient()
    const { error: deleteError } = await supabase.from("team_members").delete().eq("id", id)

    if (deleteError) {
      setError(deleteError.message)
      setDeletingId(null)
      return
    }

    setMembers((current) => current.filter((member) => member.id !== id))
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
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Team Management</h1>
        <p className="mt-1 text-muted-foreground">
          Set founders, current positions, previous batch members, and update profile photos for the public team page.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Team Member" : "Add Team Member"}</CardTitle>
          <CardDescription>
            {editingId
              ? "Update member details, replace their profile photo, or switch to an image link."
              : "Create a new founder, current team, or previous batch entry."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="display-role">Display Role</Label>
                <Input
                  id="display-role"
                  placeholder="President, Founder, Design Lead..."
                  value={formData.displayRole}
                  onChange={(e) => setFormData({ ...formData, displayRole: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Select
                  value={formData.section}
                  onValueChange={(value) => setFormData({ ...formData, section: value })}
                >
                  <SelectTrigger id="section">
                    <SelectValue placeholder="Choose a section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="founder">Founder</SelectItem>
                    <SelectItem value="co_founder">Co-Founder</SelectItem>
                    <SelectItem value="current_team">Current Team</SelectItem>
                    <SelectItem value="vice_captain">Vice Captains</SelectItem>
                    <SelectItem value="jr_captain">Junior Captains</SelectItem>
                    <SelectItem value="previous_batch">Previous Batch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sort-order">Sort Order</Label>
                <Input
                  id="sort-order"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="batch-label">Batch Label</Label>
                <Select
                  value={formData.batchLabel}
                  onValueChange={(value) => setFormData({ ...formData, batchLabel: value })}
                  disabled={formData.section !== "previous_batch"}
                >
                  <SelectTrigger id="batch-label">
                    <SelectValue placeholder="Select a batch label" />
                  </SelectTrigger>
                  <SelectContent>
                    {batchOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.section === "previous_batch" && formData.batchLabel === "Custom" && (
                <div className="space-y-2">
                  <Label htmlFor="custom-batch-label">Custom Batch Label</Label>
                  <Input
                    id="custom-batch-label"
                    placeholder="2020-21 Team"
                    value={formData.customBatchLabel}
                    onChange={(e) =>
                      setFormData({ ...formData, customBatchLabel: e.target.value })
                    }
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="image-file">Upload Image</Label>
                <Input
                  id="image-file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageFileChange(e.target.files?.[0] || null)}
                />
                <p className="text-xs text-muted-foreground">
                  Upload a profile photo under 500 KB to the public Supabase bucket <code>{TEAM_BUCKET}</code>, or use an image URL below.
                </p>
                {imageFile && (
                  <p className="text-xs text-muted-foreground">
                    Selected: {imageFile.name} ({Math.round(imageFile.size / 1024)} KB)
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => {
                    setRemoveExistingImage(false)
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }}
                  placeholder="https://example.com/member-photo.jpg"
                />
                <p className="text-xs text-muted-foreground">
                  If both are provided, the uploaded image is used.
                </p>
              </div>

              {editingId && formData.imageUrl && !removeExistingImage && !imageFile && (
                <div className="space-y-2 lg:col-span-2">
                  <Label>Current Photo</Label>
                  <div className="flex items-center gap-4 rounded-lg border border-border p-4">
                    <img
                      src={formData.imageUrl}
                      alt={formData.name || "Team member"}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData({ ...formData, imageUrl: "" })
                        setRemoveExistingImage(true)
                      }}
                    >
                      Remove Photo
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="linkedin-url">LinkedIn URL</Label>
                <Input
                  id="linkedin-url"
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="github-url">GitHub URL</Label>
                <Input
                  id="github-url"
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="bio">Short Bio</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4 lg:col-span-2">
                <div>
                  <Label htmlFor="is-active">Visible on site</Label>
                  <p className="text-sm text-muted-foreground">
                    Turn this off to keep the member hidden without deleting the record.
                  </p>
                </div>
                <Switch
                  id="is-active"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  {editingId ? (
                    <Pencil className="mr-2 h-4 w-4" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  {editingId ? "Update Team Member" : "Add Team Member"}
                </>
              )}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" className="ml-3" onClick={resetForm}>
                Cancel Edit
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Team Records</CardTitle>
          <CardDescription>All team entries currently stored in the admin-managed team table.</CardDescription>
        </CardHeader>
        <CardContent>
          {members.length > 0 ? (
            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col gap-4 rounded-xl border border-border p-4 lg:flex-row lg:items-start lg:justify-between"
                >
                  <div className="flex items-start gap-4">
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Users className="h-5 w-5" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-foreground">{member.name}</p>
                      <p className="text-sm text-primary">{member.display_role}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span>{sectionLabels[member.section] || member.section}</span>
                        {member.batch_label && <span>{member.batch_label}</span>}
                        <span>Order {member.sort_order}</span>
                        <span>{member.is_active ? "Visible" : "Hidden"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => startEditing(member)}
                      aria-label={`Edit ${member.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(member.id)}
                      disabled={deletingId === member.id}
                      aria-label={`Delete ${member.name}`}
                    >
                      {deletingId === member.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
              No team records yet. Add the founder, co-founder, current team, vice captains, junior captains, and previous batches here.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
