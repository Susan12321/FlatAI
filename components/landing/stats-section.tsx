"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface Stats {
  totalUsers: number
  totalProperties: number
  totalBookings: number
  totalReviews: number
}

export function StatsSection() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProperties: 0,
    totalBookings: 0,
    totalReviews: 0,
  })

  useEffect(() => {
    // Simulate loading stats - in a real app, this would fetch from an API
    const mockStats = {
      totalUsers: 1250,
      totalProperties: 450,
      totalBookings: 890,
      totalReviews: 320,
    }

    // Animate numbers counting up
    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setStats({
        totalUsers: Math.floor(mockStats.totalUsers * progress),
        totalProperties: Math.floor(mockStats.totalProperties * progress),
        totalBookings: Math.floor(mockStats.totalBookings * progress),
        totalReviews: Math.floor(mockStats.totalReviews * progress),
      })

      if (currentStep >= steps) {
        clearInterval(timer)
        setStats(mockStats)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [])

  const statItems = [
    { label: "Happy Users", value: stats.totalUsers, suffix: "+" },
    { label: "Properties Listed", value: stats.totalProperties, suffix: "+" },
    { label: "Successful Bookings", value: stats.totalBookings, suffix: "+" },
    { label: "Reviews & Ratings", value: stats.totalReviews, suffix: "+" },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Trusted by Thousands</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join our growing community of satisfied tenants and landlords who have found their perfect match through
            RentEase.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((stat, index) => (
            <Card key={index} className="text-center border-border">
              <CardContent className="pt-6">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value.toLocaleString()}
                  {stat.suffix}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
