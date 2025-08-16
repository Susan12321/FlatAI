import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const reviewId = Number.parseInt(params.id)
    const { rating, reviewText } = await request.json()

    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
    })

    if (!existingReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    // Check if user owns the review or is admin
    if (session.user.role !== "admin" && existingReview.tenantId !== Number.parseInt(session.user.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    const updateData: any = {}
    if (rating) updateData.rating = Number.parseInt(rating)
    if (reviewText !== undefined) updateData.reviewText = reviewText

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: updateData,
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

    return NextResponse.json(review)
  } catch (error) {
    console.error("Error updating review:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const reviewId = Number.parseInt(params.id)

    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
    })

    if (!existingReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    // Check if user owns the review or is admin
    if (session.user.role !== "admin" && existingReview.tenantId !== Number.parseInt(session.user.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.review.delete({
      where: { id: reviewId },
    })

    return NextResponse.json({ message: "Review deleted successfully" })
  } catch (error) {
    console.error("Error deleting review:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
