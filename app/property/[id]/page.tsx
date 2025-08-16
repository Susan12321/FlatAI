"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { PropertyReviews } from "@/components/reviews/property-reviews"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Star } from "lucide-react"

interface Property {
  id: number
  title: string
  description: string
  address: string
  city: string
  rent: number
  availableFrom: string
  images: { imageUrl: string }[]
  landlord: { name: string; email: string }
  reviews: { rating: number }[]
  _count: { reviews: number }
}

export default function PropertyDetailPage() {
  const params = useParams()
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchProperty()
    }
  }, [params.id])

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProperty(data)
      }
    } catch (error) {
      console.error("Error fetching property:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateAverageRating = () => {
    if (!property || property.reviews.length === 0) return 0
    const sum = property.reviews.reduce((acc, review) => acc + review.rating, 0)
    return sum / property.reviews.length
  }

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!property) {
    return <div className="text-center py-8">Property not found</div>
  }

  const averageRating = calculateAverageRating()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          {property.images.length > 0 && (
            <img
              src={property.images[0].imageUrl || "/placeholder.svg"}
              alt={property.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{property.title}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {property.address}, {property.city}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold text-primary">£{property.rent}/month</span>
              {averageRating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">
                    {averageRating.toFixed(1)} ({property._count.reviews} reviews)
                  </span>
                </div>
              )}
            </div>

            <p className="text-muted-foreground">{property.description}</p>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Available from: {new Date(property.availableFrom).toLocaleDateString()}
            </div>

            <div className="flex items-center justify-between">
              <Badge variant="secondary">Listed by {property.landlord.name}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <PropertyReviews propertyId={property.id} propertyTitle={property.title} />
    </div>
  )
}
