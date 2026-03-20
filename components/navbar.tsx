"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Bell, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

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
    
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/apple-icon.png" alt="TechGenz logo" width={40} height={40} className="h-10 w-10 object-contain" />
          <span className="text-xl font-bold tracking-tight text-foreground">
            Tech<span className="text-primary">Genz</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/notifications" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/auth/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/sign-up">Join Now</Link>
          </Button>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-md p-2 text-muted-foreground hover:bg-secondary md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-md px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Button variant="ghost" asChild className="justify-start">
              <Link href="/notifications" onClick={() => setIsOpen(false)}>
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Link>
            </Button>
            <div className="mt-4 flex flex-col gap-2">
              <Button variant="outline" asChild className="w-full">
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/auth/sign-up">Join Now</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
