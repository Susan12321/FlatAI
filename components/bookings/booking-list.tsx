"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Booking {
  id: number
  status: "pending" | "approved" | "rejected"
  bookingDate: string
  property: {
    id: number
    title: string
    address: string
    city: string
    rent: number
    images: { imageUrl: string }[]
    landlord: { name: string; email: string }
  }
  tenant: { name: string; email: string }
}

interface BookingListProps {
  userRole?: "tenant" | "landlord"
}

export function BookingList({ userRole }: BookingListProps) {
  const { data: session } = useSession()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings")
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (bookingId: number, status: "approved" | "rejected") => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        setBookings((prev) => prev.map((booking) => (booking.id === bookingId ? { ...booking, status } : booking)))
      }
    } catch (error) {
      console.error("Error updating booking:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading bookings...</div>
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No bookings found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{booking.property.title}</CardTitle>
                <CardDescription>
                  {booking.property.address}, {booking.property.city}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(booking.status)}>{booking.status.toUpperCase()}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {booking.property.images.length > 0 && (
                <img
                  src={booking.property.images[0].imageUrl || "/placeholder.svg"}
                  alt={booking.property.title}
                  className="w-full h-32 object-cover rounded"
                />
              )}
              <div className="space-y-2">
                <p className="text-lg font-semibold">£{booking.property.rent}/month</p>
                <p className="text-sm text-muted-foreground">
                  Requested on: {new Date(booking.bookingDate).toLocaleDateString()}
                </p>
                {userRole === "landlord" && (
                  <div>
                    <p className="text-sm">
                      <strong>Tenant:</strong> {booking.tenant.name} ({booking.tenant.email})
                    </p>
                  </div>
                )}
                {userRole === "tenant" && (
                  <div>
                    <p className="text-sm">
                      <strong>Landlord:</strong> {booking.property.landlord.name} ({booking.property.landlord.email})
                    </p>
                  </div>
                )}
                {userRole === "landlord" && booking.status === "pending" && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleStatusUpdate(booking.id, "approved")}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                    <Button onClick={() => handleStatusUpdate(booking.id, "rejected")} size="sm" variant="destructive">
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
