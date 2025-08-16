"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

interface SearchFilters {
  city: string
  minRent: string
  maxRent: string
  sortBy: string
}

interface PropertySearchProps {
  onSearch: (filters: SearchFilters) => void
}

export function PropertySearch({ onSearch }: PropertySearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    city: "",
    minRent: "",
    maxRent: "",
    sortBy: "newest",
  })

  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleSearch = () => {
    onSearch(filters)
  }

  const handleReset = () => {
    const resetFilters = {
      city: "",
      minRent: "",
      maxRent: "",
      sortBy: "newest",
    }
    setFilters(resetFilters)
    onSearch(resetFilters)
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="Enter city"
              value={filters.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="minRent">Min Rent (£)</Label>
            <Input
              id="minRent"
              type="number"
              placeholder="0"
              value={filters.minRent}
              onChange={(e) => handleInputChange("minRent", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxRent">Max Rent (£)</Label>
            <Input
              id="maxRent"
              type="number"
              placeholder="5000"
              value={filters.maxRent}
              onChange={(e) => handleInputChange("maxRent", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sortBy">Sort By</Label>
            <Select value={filters.sortBy} onValueChange={(value) => handleInputChange("sortBy", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end gap-2">
            <Button onClick={handleSearch} className="flex-1">
              Search
            </Button>
            <Button onClick={handleReset} variant="outline">
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
