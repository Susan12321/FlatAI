"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PropertyFormProps {
  property?: any
  onSuccess?: () => void
}

export function PropertyForm({ property, onSuccess }: PropertyFormProps) {
  const [formData, setFormData] = useState({
    title: property?.title || "",
    description: property?.description || "",
    address: property?.address || "",
    city: property?.city || "",
    postalCode: property?.postalCode || "",
    rent: property?.rent || "",
    availableFrom: property?.availableFrom ? property.availableFrom.split("T")[0] : "",
  })
  const [images, setImages] = useState<string[]>(property?.images?.map((img: any) => img.imageUrl) || [])
  const [newImageUrl, setNewImageUrl] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const addImage = () => {
    if (newImageUrl.trim()) {
      setImages((prev) => [...prev, newImageUrl.trim()])
      setNewImageUrl("")
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const url = property ? `/api/properties/${property.id}` : "/api/properties"
      const method = property ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          images,
        }),
      })

      if (response.ok) {
        onSuccess?.()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to save property")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{property ? "Edit Property" : "Add New Property"}</CardTitle>
        <CardDescription>
          {property ? "Update your property details" : "Fill in the details to list your property"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Property Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Beautiful 2-bedroom apartment"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rent">Monthly Rent (£)</Label>
              <Input
                id="rent"
                name="rent"
                type="number"
                value={formData.rent}
                onChange={handleInputChange}
                placeholder="1200"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your property..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="123 Main Street"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="London"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="SW1A 1AA"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="availableFrom">Available From</Label>
            <Input
              id="availableFrom"
              name="availableFrom"
              type="date"
              value={formData.availableFrom}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Property Images</Label>
            <div className="flex gap-2">
              <Input
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Enter image URL"
              />
              <Button type="button" onClick={addImage} variant="outline">
                Add Image
              </Button>
            </div>
            {images.length > 0 && (
              <div className="space-y-2">
                {images.map((url, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded">
                    <img
                      src={url || "/placeholder.svg"}
                      alt={`Property ${index + 1}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <span className="flex-1 text-sm truncate">{url}</span>
                    <Button type="button" onClick={() => removeImage(index)} variant="destructive" size="sm">
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : property ? "Update Property" : "Add Property"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
