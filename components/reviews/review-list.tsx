"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Trash2 } from "lucide-react"

interface Review {
  id: number
  rating: number
  reviewText: string
  createdAt: string
  tenant: {
    name: string
  }
  property?: {
    title: string
  }
}

interface ReviewListProps {
  propertyId?: number
  showPropertyTitle?: boolean
}

export function ReviewList({ propertyId, showPropertyTitle = false }: ReviewListProps) {
  const { data: session } = useSession()
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [propertyId])

  const fetchReviews = async () => {
    try {
      const url = propertyId ? `/api/reviews?propertyId=${propertyId}` : "/api/reviews"
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (reviewId: number) => {
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        const response = await fetch(`/api/reviews/${reviewId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          setReviews((prev) => prev.filter((r) => r.id !== reviewId))
        }
      } catch (error) {
        console.error("Error deleting review:", error)
      }
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading reviews...</div>
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No reviews yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {renderStars(review.rating)}
                  <span className="text-sm text-muted-foreground">by {review.tenant.name}</span>
                </CardTitle>
                {showPropertyTitle && review.property && <CardDescription>{review.property.title}</CardDescription>}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                {(session?.user.role === "admin" ||
                  (session?.user.id && Number.parseInt(session.user.id) === review.tenant.id)) && (
                  <Button
                    onClick={() => handleDelete(review.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          {review.reviewText && (
            <CardContent>
              <p className="text-muted-foreground">{review.reviewText}</p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
