"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Calendar } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PropertyCardProps {
  property: {
    id: number
    title: string
    description: string
    address: string
    city: string
    rent: number
    availableFrom: string
    images: { imageUrl: string }[]
    landlord: { name: string }
    averageRating: number
    _count: { reviews: number }
  }
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { data: session } = useSession()
  const [isBooking, setIsBooking] = useState(false)
  const [bookingMessage, setBookingMessage] = useState("")

  const handleBooking = async () => {
    if (!session) {
      setBookingMessage("Please sign in to book a property")
      return
    }

    if (session.user.role !== "tenant") {
      setBookingMessage("Only tenants can book properties")
      return
    }

    setIsBooking(true)
    setBookingMessage("")

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ propertyId: property.id }),
      })

      const data = await response.json()

      if (response.ok) {
        setBookingMessage("Booking request sent successfully!")
      } else {
        setBookingMessage(data.error || "Failed to send booking request")
      }
    } catch (error) {
      setBookingMessage("An error occurred. Please try again.")
    } finally {
      setIsBooking(false)
    }
  }

  return (
    <Card className="overflow-hidden">
      {property.images.length > 0 && (
        <img
          src={property.images[0].imageUrl || "/placeholder.svg"}
          alt={property.title}
          className="w-full h-48 object-cover"
        />
      )}
      <CardHeader>
        <CardTitle className="text-lg">{property.title}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {property.address}, {property.city}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-primary">£{property.rent}/month</span>
            {property.averageRating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">
                  {property.averageRating.toFixed(1)} ({property._count.reviews})
                </span>
              </div>
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">{property.description}</p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            Available from: {new Date(property.availableFrom).toLocaleDateString()}
          </div>

          <div className="flex items-center justify-between">
            <Badge variant="secondary">By {property.landlord.name}</Badge>
          </div>

          {bookingMessage && (
            <Alert className={bookingMessage.includes("successfully") ? "border-green-500" : "border-red-500"}>
              <AlertDescription>{bookingMessage}</AlertDescription>
            </Alert>
          )}

          <Button onClick={handleBooking} disabled={isBooking} className="w-full">
            {isBooking ? "Sending Request..." : "Request Booking"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
