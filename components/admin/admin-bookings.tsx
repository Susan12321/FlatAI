"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AdminBooking {
  id: number
  status: "pending" | "approved" | "rejected"
  bookingDate: string
  property: {
    id: number
    title: string
    address: string
    city: string
    rent: number
    landlord: { name: string; email: string }
  }
  tenant: { name: string; email: string }
}

export function AdminBookings() {
  const [bookings, setBookings] = useState<AdminBooking[]>([])
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Bookings</CardTitle>
        <CardDescription>Monitor all booking requests across the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{booking.property.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {booking.property.address}, {booking.property.city}
                  </p>
                </div>
                <Badge className={getStatusColor(booking.status)}>{booking.status.toUpperCase()}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium">Tenant</p>
                  <p>{booking.tenant.name}</p>
                  <p className="text-muted-foreground">{booking.tenant.email}</p>
                </div>
                <div>
                  <p className="font-medium">Landlord</p>
                  <p>{booking.property.landlord.name}</p>
                  <p className="text-muted-foreground">{booking.property.landlord.email}</p>
                </div>
                <div>
                  <p className="font-medium">Details</p>
                  <p>£{booking.property.rent}/month</p>
                  <p className="text-muted-foreground">
                    Requested: {new Date(booking.bookingDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
