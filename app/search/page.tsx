"use client"

import { useState, useEffect } from "react"
import { PropertySearch } from "@/components/search/property-search"
import { PropertyCard } from "@/components/search/property-card"

interface SearchFilters {
  city: string
  minRent: string
  maxRent: string
  sortBy: string
}

export default function SearchPage() {
  const [properties, setProperties] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (filters: SearchFilters) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.city) params.append("city", filters.city)
      if (filters.minRent) params.append("minRent", filters.minRent)
      if (filters.maxRent) params.append("maxRent", filters.maxRent)
      if (filters.sortBy) params.append("sortBy", filters.sortBy)

      const response = await fetch(`/api/search?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setProperties(data)
      }
    } catch (error) {
      console.error("Error searching properties:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Load all properties initially
    handleSearch({ city: "", minRent: "", maxRent: "", sortBy: "newest" })
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Find Your Perfect Home</h1>
        <p className="text-muted-foreground">Search and book properties that match your needs</p>
      </div>

      <PropertySearch onSearch={handleSearch} />

      {isLoading ? (
        <div className="text-center py-8">Loading properties...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property: any) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}

      {!isLoading && properties.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No properties found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
