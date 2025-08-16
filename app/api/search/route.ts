import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city")
    const minRent = searchParams.get("minRent")
    const maxRent = searchParams.get("maxRent")
    const sortBy = searchParams.get("sortBy") || "newest"

    const where: any = {}

    if (city) {
      where.city = {
        contains: city,
        mode: "insensitive",
      }
    }

    if (minRent || maxRent) {
      where.rent = {}
      if (minRent) where.rent.gte = Number.parseFloat(minRent)
      if (maxRent) where.rent.lte = Number.parseFloat(maxRent)
    }

    let orderBy: any = { createdAt: "desc" }

    switch (sortBy) {
      case "price-low":
        orderBy = { rent: "asc" }
        break
      case "price-high":
        orderBy = { rent: "desc" }
        break
      case "newest":
      default:
        orderBy = { createdAt: "desc" }
        break
    }

    const properties = await prisma.property.findMany({
      where,
      include: {
        images: true,
        landlord: {
          select: {
            id: true,
            name: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      orderBy,
    })

    // Calculate average rating for each property
    const propertiesWithRating = properties.map((property) => ({
      ...property,
      averageRating:
        property.reviews.length > 0
          ? property.reviews.reduce((sum, review) => sum + review.rating, 0) / property.reviews.length
          : 0,
    }))

    return NextResponse.json(propertiesWithRating)
  } catch (error) {
    console.error("Error searching properties:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
