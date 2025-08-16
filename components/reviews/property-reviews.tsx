"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { ReviewForm } from "./review-form"
import { ReviewList } from "./review-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PropertyReviewsProps {
  propertyId: number
  propertyTitle: string
}

export function PropertyReviews({ propertyId, propertyTitle }: PropertyReviewsProps) {
  const { data: session } = useSession()
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [canReview, setCanReview] = useState(false)
  const [hasReviewed, setHasReviewed] = useState(false)

  useEffect(() => {
    checkReviewEligibility()
  }, [session, propertyId])

  const checkReviewEligibility = async () => {
    if (!session || session.user.role !== "tenant") {
      return
    }

    try {
      // Check if user has approved booking
      const bookingsResponse = await fetch("/api/bookings")
      if (bookingsResponse.ok) {
        const bookings = await bookingsResponse.json()
        const hasApprovedBooking = bookings.some(
          (booking: any) => booking.property.id === propertyId && booking.status === "approved",
        )

        if (hasApprovedBooking) {
          // Check if user already reviewed
          const reviewsResponse = await fetch(`/api/reviews?propertyId=${propertyId}`)
          if (reviewsResponse.ok) {
            const reviews = await reviewsResponse.json()
            const userReview = reviews.find((review: any) => Number.parseInt(session.user.id) === review.tenant.id)

            setHasReviewed(!!userReview)
            setCanReview(!userReview)
          }
        }
      }
    } catch (error) {
      console.error("Error checking review eligibility:", error)
    }
  }

  const handleReviewSuccess = () => {
    setShowReviewForm(false)
    setCanReview(false)
    setHasReviewed(true)
    // Refresh the review list
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reviews & Ratings</CardTitle>
          <CardDescription>See what tenants are saying about this property</CardDescription>
        </CardHeader>
        <CardContent>
          {canReview && !showReviewForm && (
            <div className="mb-4">
              <Button onClick={() => setShowReviewForm(true)}>Write a Review</Button>
            </div>
          )}

          {hasReviewed && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-sm text-green-800">
                Thank you for your review! You have already reviewed this property.
              </p>
            </div>
          )}

          {showReviewForm && (
            <div className="mb-6">
              <ReviewForm propertyId={propertyId} propertyTitle={propertyTitle} onSuccess={handleReviewSuccess} />
              <div className="mt-4 text-center">
                <Button onClick={() => setShowReviewForm(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <ReviewList propertyId={propertyId} />
        </CardContent>
      </Card>
    </div>
  )
}
