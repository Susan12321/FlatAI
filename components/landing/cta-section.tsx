"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Home, Users } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground">
              Whether you're looking for a home or have a property to rent, RentEase is here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">For Tenants</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Discover your perfect home from thousands of verified listings. Search by location, price, and
                  amenities to find exactly what you're looking for.
                </p>
                <Button size="lg" asChild className="w-full">
                  <Link href="/search" className="flex items-center justify-center gap-2">
                    Find Properties
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Home className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">For Landlords</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  List your properties and connect with quality tenants. Manage bookings, communicate with renters, and
                  grow your rental business with ease.
                </p>
                <Button size="lg" variant="outline" asChild className="w-full bg-transparent">
                  <Link href="/auth/signup" className="flex items-center justify-center gap-2">
                    List Your Property
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
