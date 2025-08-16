"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Home } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary/5 to-accent/5 py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Home className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Find Your Perfect <span className="text-primary">Rental</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Connect with trusted landlords and discover your ideal home. RentEase makes finding and listing properties
              simple, secure, and stress-free.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/search" className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Start Searching
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 bg-transparent">
              <Link href="/auth/signup">List Your Property</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
