"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { BookingList } from "@/components/bookings/booking-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TenantDashboard() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!session || session.user.role !== "tenant") {
    redirect("/auth/signin")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tenant Dashboard</h1>
        <p className="text-muted-foreground">Manage your bookings and find new properties</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Bookings</CardTitle>
          <CardDescription>Track the status of your property booking requests</CardDescription>
        </CardHeader>
        <CardContent>
          <BookingList userRole="tenant" />
        </CardContent>
      </Card>
    </div>
  )
}
