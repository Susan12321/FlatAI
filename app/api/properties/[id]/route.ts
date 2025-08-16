import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: Number.parseInt(params.id) },
      include: {
        images: true,
        landlord: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        reviews: {
          include: {
            tenant: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error("Error fetching property:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "landlord") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const propertyId = Number.parseInt(params.id)
    const { title, description, address, city, postalCode, rent, availableFrom, images } = await request.json()

    // Check if property belongs to the landlord
    const existingProperty = await prisma.property.findUnique({
      where: { id: propertyId },
    })

    if (!existingProperty || existingProperty.landlordId !== Number.parseInt(session.user.id)) {
      return NextResponse.json({ error: "Property not found or unauthorized" }, { status: 404 })
    }

    // Update property
    const property = await prisma.property.update({
      where: { id: propertyId },
      data: {
        title,
        description,
        address,
        city,
        postalCode,
        rent: Number.parseFloat(rent),
        availableFrom: new Date(availableFrom),
      },
      include: {
        images: true,
      },
    })

    // Update images if provided
    if (images) {
      // Delete existing images
      await prisma.propertyImage.deleteMany({
        where: { propertyId },
      })

      // Create new images
      await prisma.propertyImage.createMany({
        data: images.map((url: string) => ({
          propertyId,
          imageUrl: url,
        })),
      })
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error("Error updating property:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "landlord") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const propertyId = Number.parseInt(params.id)

    // Check if property belongs to the landlord
    const existingProperty = await prisma.property.findUnique({
      where: { id: propertyId },
    })

    if (!existingProperty || existingProperty.landlordId !== Number.parseInt(session.user.id)) {
      return NextResponse.json({ error: "Property not found or unauthorized" }, { status: 404 })
    }

    await prisma.property.delete({
      where: { id: propertyId },
    })

    return NextResponse.json({ message: "Property deleted successfully" })
  } catch (error) {
    console.error("Error deleting property:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
