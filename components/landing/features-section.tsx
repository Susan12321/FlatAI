"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, CreditCard, Star, Search, Home } from "lucide-react"

const features = [
  {
    icon: Search,
    title: "Easy Property Search",
    description:
      "Find your perfect home with advanced filters for location, price, and amenities. Browse verified listings with detailed photos and descriptions.",
  },
  {
    icon: Shield,
    title: "Verified Listings",
    description:
      "All properties are verified by our team. Connect with trusted landlords and enjoy secure, transparent rental processes.",
  },
  {
    icon: Users,
    title: "Trusted Community",
    description:
      "Join thousands of satisfied tenants and landlords. Read reviews, ratings, and make informed decisions about your next rental.",
  },
  {
    icon: CreditCard,
    title: "Secure Transactions",
    description:
      "Safe and secure booking process with transparent pricing. No hidden fees, just straightforward rental agreements.",
  },
  {
    icon: Home,
    title: "Property Management",
    description:
      "Landlords can easily list, manage, and track their properties. Handle booking requests and communicate with tenants seamlessly.",
  },
  {
    icon: Star,
    title: "Review System",
    description:
      "Rate and review properties to help future tenants. Build trust in our community through honest feedback and experiences.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose RentEase?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We've built the most comprehensive rental platform to make your property search and management experience
            seamless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-border hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
