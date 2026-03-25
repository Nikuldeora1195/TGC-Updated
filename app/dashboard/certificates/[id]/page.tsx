import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { Award, Calendar, ExternalLink, Hash } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CertificatePreview } from "@/components/certificates/certificate-preview"

interface CertificatePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CertificateDetailPage({ params }: CertificatePageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: certificate } = await supabase
    .from("certificates")
    .select("*")
    .eq("id", id)
    .single()

  if (!certificate) {
    notFound()
  }

  const { data: template } = certificate.template_id
    ? await supabase.from("certificate_templates").select("*").eq("id", certificate.template_id).single()
    : { data: null }

  const { data: event } = certificate.event_id
    ? await supabase.from("events").select("title").eq("id", certificate.event_id).single()
    : { data: null }

  if ((!template || !template.template_url) && certificate.certificate_url && certificate.certificate_url !== "dynamic") {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">{certificate.title}</h1>
          <p className="mt-1 text-muted-foreground">
            This is a previously issued certificate stored as a direct file.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Legacy Certificate</CardTitle>
            <CardDescription>Open the stored certificate file directly.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href={certificate.certificate_url} target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Certificate
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!template || (!template.template_url && !template.html_content)) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          This certificate does not have a template assigned yet.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">{certificate.title}</h1>
        <p className="mt-1 text-muted-foreground">
          View and download your dynamically generated certificate.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <CertificatePreview
          templateUrl={template.template_url}
          templateHtml={template.html_content}
          title={certificate.title}
          recipientName={certificate.recipient_name || "Member"}
          issuedDate={certificate.issued_date}
          certificateCode={certificate.certificate_code || certificate.id}
          eventTitle={event?.title || certificate.title}
          textColor={template.text_color}
          nameYPercent={Number(template.name_y_percent)}
          dateYPercent={Number(template.date_y_percent)}
          codeYPercent={Number(template.code_y_percent)}
          actionLabel={template.html_content ? "Print or Save PDF" : "Download Certificate"}
        />

        <Card>
          <CardHeader>
            <CardTitle>Certificate Details</CardTitle>
            <CardDescription>Saved metadata for this issued certificate.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Award className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Recipient</p>
                <p className="text-sm text-muted-foreground">{certificate.recipient_name || "Member"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Issued Date</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(certificate.issued_date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Hash className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Certificate Code</p>
                <p className="text-sm text-muted-foreground">{certificate.certificate_code || certificate.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
