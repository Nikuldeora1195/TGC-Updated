export interface CertificateTemplateVariables {
  certificate_code: string
  certificate_title: string
  event_title: string
  issue_date: string
  name: string
  organization_name: string
  recipient_name: string
  background_image: string
}

export const DEFAULT_CERTIFICATE_TEMPLATE = `
<style>
  .certificate-shell {
    position: relative;
    aspect-ratio: 1.414 / 1;
    overflow: hidden;
    border-radius: 24px;
    border: 10px solid #d4af37;
    background: linear-gradient(135deg, #fffdf7 0%, #fff 45%, #f7efe1 100%);
    color: #1f2937;
    font-family: Georgia, "Times New Roman", serif;
  }

  .certificate-background {
    position: absolute;
    inset: 0;
    background-image: url('{{background_image}}');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    opacity: 0.14;
  }

  .certificate-body {
    position: relative;
    z-index: 1;
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 56px 48px;
  }

  .certificate-kicker {
    font-size: 18px;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: #8b5e34;
  }

  .certificate-title {
    margin-top: 18px;
    font-size: 52px;
    line-height: 1.05;
    font-weight: 700;
    color: #7c4d12;
  }

  .certificate-copy {
    margin-top: 24px;
    max-width: 760px;
    font-size: 20px;
    line-height: 1.7;
  }

  .certificate-name {
    margin-top: 28px;
    font-size: 46px;
    line-height: 1.15;
    font-weight: 700;
    color: #111827;
  }

  .certificate-event {
    margin-top: 18px;
    font-size: 24px;
    font-weight: 600;
    color: #92400e;
  }

  .certificate-meta {
    margin-top: 34px;
    display: flex;
    width: 100%;
    justify-content: space-between;
    gap: 20px;
    font-family: Arial, sans-serif;
    font-size: 15px;
    color: #4b5563;
  }

  .certificate-meta strong {
    display: block;
    margin-bottom: 6px;
    font-size: 12px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #111827;
  }
</style>

<div class="certificate-shell">
  <div class="certificate-background"></div>
  <div class="certificate-body">
    <div class="certificate-kicker">{{organization_name}}</div>
    <div class="certificate-title">{{certificate_title}}</div>
    <div class="certificate-copy">
      This certificate is proudly presented to
    </div>
    <div class="certificate-name">{{name}}</div>
    <div class="certificate-copy">
      for active participation and valuable contribution in
    </div>
    <div class="certificate-event">{{event_title}}</div>
    <div class="certificate-meta">
      <div>
        <strong>Issue Date</strong>
        <span>{{issue_date}}</span>
      </div>
      <div style="text-align: right;">
        <strong>Certificate Code</strong>
        <span>{{certificate_code}}</span>
      </div>
    </div>
  </div>
</div>
`.trim()

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

export function formatCertificateIssuedDate(issuedDate: string) {
  return new Date(issuedDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function buildCertificateTemplateVariables({
  certificateCode,
  certificateTitle,
  eventTitle,
  issuedDate,
  recipientName,
  organizationName = "TechGenz Club",
  backgroundImage = "",
}: {
  certificateCode: string
  certificateTitle: string
  eventTitle?: string | null
  issuedDate: string
  recipientName: string
  organizationName?: string
  backgroundImage?: string | null
}): CertificateTemplateVariables {
  return {
    certificate_code: certificateCode,
    certificate_title: certificateTitle,
    event_title: eventTitle || certificateTitle,
    issue_date: formatCertificateIssuedDate(issuedDate),
    name: recipientName,
    organization_name: organizationName,
    recipient_name: recipientName,
    background_image: backgroundImage || "",
  }
}

export function renderCertificateHtml(
  templateHtml: string | null | undefined,
  variables: CertificateTemplateVariables
) {
  const source = templateHtml?.trim() || DEFAULT_CERTIFICATE_TEMPLATE

  return source.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, token: string) => {
    const value = variables[token as keyof CertificateTemplateVariables]
    return escapeHtml(String(value ?? ""))
  })
}
