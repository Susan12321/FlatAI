import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get("tenantId")
    const landlordId = searchParams.get("landlordId")

    const where: any = {}

    if (session.user.role === "tenant") {
      where.tenantId = Number.parseInt(session.user.id)
    } else if (session.user.role === "landlord") {
      where.property = {
        landlordId: Number.parseInt(session.user.id),
      }
    } else if (tenantId) {
      where.tenantId = Number.parseInt(tenantId)
    } else if (landlordId) {
      where.property = {
        landlordId: Number.parseInt(landlordId),
      }
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        property: {
          include: {
            images: true,
            landlord: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        tenant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        bookingDate: "desc",
      },
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "tenant") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { propertyId } = await request.json()

    if (!propertyId) {
      return NextResponse.json({ error: "Property ID is required" }, { status: 400 })
    }

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: Number.parseInt(propertyId) },
    })

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Check if user already has a pending or approved booking for this property
    const existingBooking = await prisma.booking.findFirst({
      where: {
        propertyId: Number.parseInt(propertyId),
        tenantId: Number.parseInt(session.user.id),
        status: {
          in: ["pending", "approved"],
        },
      },
    })

    if (existingBooking) {
      return NextResponse.json({ error: "You already have a booking for this property" }, { status: 400 })
    }

    const booking = await prisma.booking.create({
      data: {
        propertyId: Number.parseInt(propertyId),
        tenantId: Number.parseInt(session.user.id),
        status: "pending",
      },
      include: {
        property: {
          include: {
            images: true,
          },
        },
      },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
