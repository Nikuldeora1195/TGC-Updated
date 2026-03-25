import Link from "next/link"
import { Instagram, Linkedin, Mail, MessageCircle } from "lucide-react"
import { BrandMark } from "@/components/brand-mark"

const CONTACT_EMAIL = "techgenzpacific@gmail.com"
const INSTAGRAM_URL = "https://www.instagram.com/techgenz.pacific/"
const LINKEDIN_URL = "https://linkedin.com/company/techgenzpacific"
const WHATSAPP_URL = "https://chat.whatsapp.com/Lk2Gz7foHH9Ko12wTfIctA?mode=ac_c"

const footerLinks = {
  platform: [
    { label: "Home", href: "/" },
    { label: "Events", href: "/events" },
    { label: "Team", href: "/team" },
    { label: "Gallery", href: "/gallery" },
    { label: "About", href: "/about" },
  ],
  resources: [
    { label: "Email Us", href: `mailto:${CONTACT_EMAIL}` },
    { label: "Instagram", href: INSTAGRAM_URL },
    { label: "LinkedIn", href: LINKEDIN_URL },
    { label: "WhatsApp Community", href: WHATSAPP_URL },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
}

const socialLinks = [
  { icon: Mail, href: `mailto:${CONTACT_EMAIL}`, label: "Email" },
  { icon: Instagram, href: INSTAGRAM_URL, label: "Instagram" },
  { icon: Linkedin, href: LINKEDIN_URL, label: "LinkedIn" },
  { icon: MessageCircle, href: WHATSAPP_URL, label: "WhatsApp" },
]

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center">
              <BrandMark iconClassName="h-10 w-10 rounded-xl" textClassName="h-11" />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              The official tech community of Pacific Institute of Technology. Building the future, one line of code at a time.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              <a href={`mailto:${CONTACT_EMAIL}`} className="transition-colors hover:text-foreground">
                {CONTACT_EMAIL}
              </a>
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Platform</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.platform.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Resources</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Legal</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border/50 pt-8">
          <p className="text-center text-sm text-muted-foreground">
            {new Date().getFullYear()} TechGenz, Pacific Institute of Technology. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
