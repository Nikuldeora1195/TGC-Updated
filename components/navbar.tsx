"use client"

import Link from "next/link"
import { useState } from "react"
import { Bell, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BrandMark } from "@/components/brand-mark"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/team", label: "Team" },
  { href: "/queries", label: "Queries" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 sm:px-4">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.55),rgba(15,23,42,0.28))] shadow-[0_18px_50px_rgba(2,8,23,0.28)] backdrop-blur-2xl supports-backdrop-filter:bg-[linear-gradient(135deg,rgba(15,23,42,0.42),rgba(15,23,42,0.2))]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(45,212,191,0.12),transparent_28%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent" />
          <nav className="relative mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <BrandMark iconClassName="h-10 w-10 rounded-xl" textClassName="h-11 sm:h-12" />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-transparent px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:border-white/10 hover:bg-white/8 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="rounded-full border border-transparent bg-white/5 text-foreground/80 hover:border-white/10 hover:bg-white/10 hover:text-foreground"
          >
            <Link href="/notifications" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="rounded-full border border-white/10 bg-white/5 text-foreground/85 hover:bg-white/10"
          >
            <Link href="/auth/login">Log in</Link>
          </Button>
          <Button
            asChild
            className="rounded-full border border-primary/30 bg-primary/85 text-primary-foreground shadow-[0_8px_25px_rgba(34,211,238,0.22)] hover:bg-primary"
          >
            <Link href="/auth/sign-up">Join Now</Link>
          </Button>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full border border-white/10 bg-white/6 p-2 text-muted-foreground transition-colors hover:bg-white/10 md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {isOpen && (
        <div className="relative border-t border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.38),rgba(15,23,42,0.22))] backdrop-blur-2xl md:hidden">
          <div className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-white/8 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Button variant="ghost" asChild className="justify-start rounded-xl hover:bg-white/8">
              <Link href="/notifications" onClick={() => setIsOpen(false)}>
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Link>
            </Button>
            <div className="mt-4 flex flex-col gap-2">
              <Button variant="outline" asChild className="w-full rounded-xl border-white/10 bg-white/5 hover:bg-white/10">
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button asChild className="w-full rounded-xl border border-primary/30 bg-primary/85 hover:bg-primary">
                <Link href="/auth/sign-up">Join Now</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </header>
  )
}
