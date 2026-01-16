"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

// Components
import { Button } from "@/components/ui/button";

const features = [
  "Supabase authentication and CRUD operations with Drizzle ORM",
  "Stripe payments integration for subscriptions and transactions",
  "Pre-built authentication UI with modern design patterns",
  "ESLint, Prettier, and Husky for code quality",
  "VitePress documentation site included and customizable",
  "Docker containerized for seamless deployment",
  "Resend email management system",
  "GitHub Actions for CI/CD workflows",
];

export const PageClient = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="font-semibold tracking-tight text-sm sm:text-base">
            NextJS Supabase Template
          </div>

          <div className="hidden sm:flex items-center gap-6 md:gap-8 text-xs sm:text-sm">
            <Link
              href="#features"
              className="text-muted-foreground hover:text-foreground transition"
            >
              Features
            </Link>
            <Link href="/login" className="text-muted-foreground hover:text-foreground transition">
              Login
            </Link>
            <Link
              href="/register"
              className="text-muted-foreground hover:text-foreground transition"
            >
              <Button>Sign up</Button>
            </Link>
          </div>

          <button
            onClick={toggleMenu}
            className="sm:hidden p-2 text-muted-foreground hover:text-foreground transition"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="sm:hidden border-t border-border bg-background">
            <div className="px-4 py-4 flex flex-col">
              <Link
                href="#features"
                onClick={closeMenu}
                className="text-sm text-muted-foreground hover:text-foreground transition block py-2"
              >
                <Button onClick={closeMenu} variant="link" size="sm">
                  Features
                </Button>
              </Link>
              <Link
                href="/login"
                onClick={closeMenu}
                className="text-sm text-muted-foreground hover:text-foreground transition block py-2"
              >
                <Button onClick={closeMenu} variant="link" size="sm">
                  Login
                </Button>
              </Link>
              <Link
                href="/register"
                className="text-sm text-muted-foreground hover:text-foreground transition block py-2"
              >
                <Button onClick={closeMenu} size="sm">
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-16 sm:pt-32 sm:pb-24 md:pt-48 md:pb-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center sm:text-left">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Open source • Actively maintained
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance mb-4 sm:mb-6 leading-tight">
            Ship full-stack apps in days, not months
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-balance mb-8 sm:mb-12 max-w-2xl leading-relaxed">
            A production-ready Next.js template with everything you need to build and deploy modern
            web apps.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-12 sm:mb-16">
            <Link href="/login">
              <Button className="w-full">Get Started</Button>
            </Link>
            <Link
              href="https://github.com/wannacry081/nextjs-supabase-template"
              target="_blank"
              rel="noreferrer"
            >
              <Button className="w-full" variant="ghost">
                Visit GitHub Repository
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 md:py-32 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 sm:mb-8 text-balance">
            Everything included
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-12 sm:mb-16 max-w-2xl">
            Built with production in mind. Get a complete foundation with all essential features
            pre-configured and ready to use.
          </p>

          {/* Bullet List */}
          <ul className="space-y-3 sm:space-y-4">
            {features.map((feature, index) => (
              <li key={index} className="flex gap-3 items-start group">
                <span className="text-muted-foreground group-hover:text-foreground transition mt-1 shrink-0 text-sm sm:text-base">
                  →
                </span>
                <span className="text-sm sm:text-base text-muted-foreground group-hover:text-foreground transition leading-relaxed">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 border-t border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4 text-balance">
            Ready to build?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
            Start with our template and focus on building features instead of boilerplate.
          </p>
          <Link
            href="https://github.com/wannacry081/nextjs-supabase-template"
            target="_blank"
            rel="noreferrer"
          >
            <Button>
              Clone Template
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-6 text-xs text-muted-foreground">
            <p>© 2026 TemplateKit By WannaCry081</p>
            <div className="flex items-center gap-4 sm:gap-6">
              <Link
                href="https://github.com/wannacry081"
                className="hover:text-foreground transition"
              >
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
