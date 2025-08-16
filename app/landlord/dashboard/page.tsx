"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PropertyForm } from "@/components/properties/property-form"
import { PropertyList } from "@/components/properties/property-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandlordDashboard() {
  const { data: session, status } = useSession()
  const [showForm, setShowForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null)

  if (status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!session || session.user.role !== "landlord") {
    redirect("/auth/signin")
  }

  const handleEdit = (property: any) => {
    setEditingProperty(property)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingProperty(null)
    // Refresh the property list
    window.location.reload()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Landlord Dashboard</h1>
        <p className="text-muted-foreground">Manage your properties and bookings</p>
      </div>

      {showForm ? (
        <div className="mb-8">
          <PropertyForm property={editingProperty} onSuccess={handleFormSuccess} />
          <div className="mt-4 text-center">
            <Button
              onClick={() => {
                setShowForm(false)
                setEditingProperty(null)
              }}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Properties</CardTitle>
              <CardDescription>Manage your property listings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowForm(true)} className="mb-4">
                Add New Property
              </Button>
              <PropertyList
                landlordId={Number.parseInt(session.user.id)}
                onEdit={handleEdit}
                onDelete={() => window.location.reload()}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
