"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Property {
  id: number
  title: string
  description: string
  address: string
  city: string
  rent: number
  availableFrom: string
  images: { imageUrl: string }[]
  _count: {
    bookings: number
    reviews: number
  }
}

interface PropertyListProps {
  landlordId?: number
  onEdit?: (property: Property) => void
  onDelete?: (propertyId: number) => void
}

export function PropertyList({ landlordId, onEdit, onDelete }: PropertyListProps) {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProperties()
  }, [landlordId])

  const fetchProperties = async () => {
    try {
      const url = landlordId ? `/api/properties?landlordId=${landlordId}` : "/api/properties"
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setProperties(data)
      }
    } catch (error) {
      console.error("Error fetching properties:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (propertyId: number) => {
    if (confirm("Are you sure you want to delete this property?")) {
      try {
        const response = await fetch(`/api/properties/${propertyId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          setProperties((prev) => prev.filter((p) => p.id !== propertyId))
          onDelete?.(propertyId)
        }
      } catch (error) {
        console.error("Error deleting property:", error)
      }
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading properties...</div>
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No properties found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <Card key={property.id} className="overflow-hidden">
          {property.images.length > 0 && (
            <img
              src={property.images[0].imageUrl || "/placeholder.svg"}
              alt={property.title}
              className="w-full h-48 object-cover"
            />
          )}
          <CardHeader>
            <CardTitle className="text-lg">{property.title}</CardTitle>
            <CardDescription className="text-sm">
              {property.address}, {property.city}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">£{property.rent}/month</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{property.description}</p>
              <div className="flex gap-2">
                <Badge variant="secondary">{property._count.bookings} bookings</Badge>
                <Badge variant="secondary">{property._count.reviews} reviews</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Available from: {new Date(property.availableFrom).toLocaleDateString()}
              </div>
              {(onEdit || onDelete) && (
                <div className="flex gap-2 pt-2">
                  {onEdit && (
                    <Button onClick={() => onEdit(property)} variant="outline" size="sm">
                      Edit
                    </Button>
                  )}
                  {onDelete && (
                    <Button onClick={() => handleDelete(property.id)} variant="destructive" size="sm">
                      Delete
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
