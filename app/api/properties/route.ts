import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const landlordId = searchParams.get("landlordId")

    const where = landlordId ? { landlordId: Number.parseInt(landlordId) } : {}

    const properties = await prisma.property.findMany({
      where,
      include: {
        images: true,
        landlord: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(properties)
  } catch (error) {
    console.error("Error fetching properties:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "landlord") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, address, city, postalCode, rent, availableFrom, images } = await request.json()

    // Validate required fields
    if (!title || !address || !city || !postalCode || !rent || !availableFrom) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const property = await prisma.property.create({
      data: {
        landlordId: Number.parseInt(session.user.id),
        title,
        description,
        address,
        city,
        postalCode,
        rent: Number.parseFloat(rent),
        availableFrom: new Date(availableFrom),
        images: {
          create: images?.map((url: string) => ({ imageUrl: url })) || [],
        },
      },
      include: {
        images: true,
      },
    })

    return NextResponse.json(property, { status: 201 })
  } catch (error) {
    console.error("Error creating property:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
