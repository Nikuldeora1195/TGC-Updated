"use client"

import { useMemo, useRef, useState } from "react"
import Image from "next/image"
import { Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  buildCertificateTemplateVariables,
  renderCertificateHtml,
} from "@/lib/certificates"

interface CertificatePreviewProps {
  templateUrl?: string | null
  templateHtml?: string | null
  title: string
  recipientName: string
  issuedDate: string
  certificateCode: string
  eventTitle?: string | null
  organizationName?: string
  textColor?: string | null
  nameYPercent?: number | null
  dateYPercent?: number | null
  codeYPercent?: number | null
  actionLabel?: string
}

function getLegacyIssuedDate(issuedDate: string) {
  return new Date(issuedDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function CertificatePreview({
  templateUrl,
  templateHtml,
  title,
  recipientName,
  issuedDate,
  certificateCode,
  eventTitle,
  organizationName,
  textColor,
  nameYPercent,
  dateYPercent,
  codeYPercent,
  actionLabel = "Print or Save PDF",
}: CertificatePreviewProps) {
  const [downloading, setDownloading] = useState(false)
  const previewRef = useRef<HTMLDivElement | null>(null)

  const renderedHtml = useMemo(() => {
    if (!templateHtml) {
      return null
    }

    return renderCertificateHtml(
      templateHtml,
      buildCertificateTemplateVariables({
        certificateCode,
        certificateTitle: title,
        eventTitle,
        issuedDate,
        recipientName,
        organizationName,
        backgroundImage: templateUrl,
      })
    )
  }, [certificateCode, eventTitle, issuedDate, organizationName, recipientName, templateHtml, templateUrl, title])

  function buildPrintableDocument(markup: string) {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <style>
      body {
        margin: 0;
        padding: 24px;
        background: #f8fafc;
        font-family: Arial, sans-serif;
      }
      .certificate-print-root {
        max-width: 1400px;
        margin: 0 auto;
      }
      @media print {
        body {
          padding: 0;
          background: white;
        }
      }
    </style>
  </head>
  <body>
    <div class="certificate-print-root">${markup}</div>
  </body>
</html>`
  }

  async function handleDownload() {
    if (!renderedHtml) {
      setDownloading(true)

      try {
        const img = document.createElement("img")
        img.crossOrigin = "anonymous"
        img.src = templateUrl || ""

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve()
          img.onerror = () => reject(new Error("Template image could not be loaded."))
        })

        const canvas = document.createElement("canvas")
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight

        const context = canvas.getContext("2d")
        if (!context) throw new Error("Canvas is not available.")

        context.drawImage(img, 0, 0, canvas.width, canvas.height)
        context.textAlign = "center"
        context.fillStyle = textColor || "#111827"

        context.font = `bold ${Math.max(40, Math.round(canvas.width * 0.04))}px serif`
        context.fillText(recipientName, canvas.width / 2, canvas.height * ((nameYPercent || 44) / 100))

        context.font = `${Math.max(22, Math.round(canvas.width * 0.018))}px sans-serif`
        context.fillText(
          `Issued on ${getLegacyIssuedDate(issuedDate)}`,
          canvas.width / 2,
          canvas.height * ((dateYPercent || 60) / 100)
        )

        context.font = `${Math.max(20, Math.round(canvas.width * 0.015))}px monospace`
        context.fillText(
          `Certificate Code: ${certificateCode}`,
          canvas.width / 2,
          canvas.height * ((codeYPercent || 68) / 100)
        )

        const link = document.createElement("a")
        link.href = canvas.toDataURL("image/png")
        link.download = `${title}-${recipientName}`.replace(/\s+/g, "-").toLowerCase() + ".png"
        link.click()
      } finally {
        setDownloading(false)
      }

      return
    }

    const previewMarkup = previewRef.current?.innerHTML
    if (!previewMarkup) return

    setDownloading(true)

    try {
      const iframe = document.createElement("iframe")
      iframe.style.position = "fixed"
      iframe.style.right = "0"
      iframe.style.bottom = "0"
      iframe.style.width = "0"
      iframe.style.height = "0"
      iframe.style.border = "0"
      iframe.setAttribute("aria-hidden", "true")
      document.body.appendChild(iframe)

      const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document
      const iframeWindow = iframe.contentWindow

      if (!iframeDocument || !iframeWindow) {
        document.body.removeChild(iframe)
        return
      }

      iframeDocument.open()
      iframeDocument.write(buildPrintableDocument(previewMarkup))
      iframeDocument.close()

      iframe.onload = () => {
        iframeWindow.focus()
        iframeWindow.print()
        window.setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe)
          }
        }, 1000)
      }
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="space-y-6">
      {renderedHtml ? (
        <div
          ref={previewRef}
          className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
      ) : (
        <div className="relative aspect-[1.414/1] overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <Image src={templateUrl || ""} alt={title} fill unoptimized className="object-cover" />

          <div
            className="absolute left-1/2 -translate-x-1/2 text-center text-2xl font-bold sm:text-3xl"
            style={{ top: `${nameYPercent || 44}%`, color: textColor || "#111827" }}
          >
            {recipientName}
          </div>

          <div
            className="absolute left-1/2 -translate-x-1/2 text-center text-sm sm:text-base"
            style={{ top: `${dateYPercent || 60}%`, color: textColor || "#111827" }}
          >
            Issued on {getLegacyIssuedDate(issuedDate)}
          </div>

          <div
            className="absolute left-1/2 -translate-x-1/2 text-center font-mono text-xs sm:text-sm"
            style={{ top: `${codeYPercent || 68}%`, color: textColor || "#111827" }}
          >
            Certificate Code: {certificateCode}
          </div>
        </div>
      )}

      <Button onClick={handleDownload} disabled={downloading}>
        {downloading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Preparing...
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            {actionLabel}
          </>
        )}
      </Button>
    </div>
  )
}
