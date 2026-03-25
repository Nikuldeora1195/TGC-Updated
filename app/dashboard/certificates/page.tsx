"use client"

import { useEffect, useState } from "react"
import { Award, Calendar, ExternalLink, Plus, Upload } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface Certificate {
  id: string
  title: string
  issued_date: string
  event_id: string | null
  recipient_name: string | null
  certificate_code: string | null
  template_id: string | null
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<"student" | "core_team" | "admin">("student")

  useEffect(() => {
    async function fetchCertificates() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: member } = await supabase
          .from("members")
          .select("role")
          .eq("id", user.id)
          .single()

        setRole((member?.role || "student") as "student" | "core_team" | "admin")

        const { data } = await supabase
          .from("certificates")
          .select("*")
          .eq("member_id", user.id)
          .order("issued_date", { ascending: false })

        setCertificates(data || [])
      }
      setLoading(false)
    }

    fetchCertificates()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
            {role === "admin" ? "Certificates" : "My Certificates"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {role === "admin"
              ? "Manage certificate templates on the web and issue certificates to event attendees."
              : "View and download your earned certificates."}
          </p>
        </div>

        {role === "admin" && (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" asChild>
              <Link href="/dashboard/certificates/issue">
                <Upload className="mr-2 h-4 w-4" />
                Upload Template
              </Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/certificates/issue">
                <Plus className="mr-2 h-4 w-4" />
                Issue Certificates
              </Link>
            </Button>
          </div>
        )}
      </div>

      {role === "admin" && (
        <Card>
          <CardHeader>
            <CardTitle>Complete Certificate Flow</CardTitle>
            <CardDescription>Everything is handled on the web, without needing local file generation for each student.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Upload one reusable template, pick an event, select attendees marked present, and issue certificates directly from the admin certificate panel.
          </CardContent>
        </Card>
      )}

      {certificates.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <Card key={cert.id} className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
              <CardHeader className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-4">{cert.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Issued on {new Date(cert.issued_date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link href={`/dashboard/certificates/${cert.id}`}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <Award className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-semibold text-foreground">
              {role === "admin" ? "Start issuing certificates" : "No certificates yet"}
            </h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {role === "admin"
                ? "Everything is handled on the web. Upload one reusable template, choose an event, and issue certificates to attendees marked present."
                : "Attend events and workshops to earn certificates. They will appear here once issued."}
            </p>
            {role === "admin" && (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button variant="outline" asChild>
                  <Link href="/dashboard/certificates/issue">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Template
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/dashboard/certificates/issue">
                    <Plus className="mr-2 h-4 w-4" />
                    Open Web Flow
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
