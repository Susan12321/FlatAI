import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get("propertyId")

    const where = propertyId ? { propertyId: Number.parseInt(propertyId) } : {}

    const reviews = await prisma.review.findMany({
      where,
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "tenant") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { propertyId, rating, reviewText } = await request.json()

    // Validate required fields
    if (!propertyId || !rating) {
      return NextResponse.json({ error: "Property ID and rating are required" }, { status: 400 })
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: Number.parseInt(propertyId) },
    })

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Check if tenant has an approved booking for this property
    const approvedBooking = await prisma.booking.findFirst({
      where: {
        propertyId: Number.parseInt(propertyId),
        tenantId: Number.parseInt(session.user.id),
        status: "approved",
      },
    })

    if (!approvedBooking) {
      return NextResponse.json({ error: "You can only review properties you have booked" }, { status: 400 })
    }

    // Check if user already reviewed this property
    const existingReview = await prisma.review.findUnique({
      where: {
        propertyId_tenantId: {
          propertyId: Number.parseInt(propertyId),
          tenantId: Number.parseInt(session.user.id),
        },
      },
    })

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this property" }, { status: 400 })
    }

    const review = await prisma.review.create({
      data: {
        propertyId: Number.parseInt(propertyId),
        tenantId: Number.parseInt(session.user.id),
        rating: Number.parseInt(rating),
        reviewText,
      },
      include: {
        tenant: {
          select: {
            name: true,
          },
        },
        property: {
          select: {
            title: true,
          },
        },
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
