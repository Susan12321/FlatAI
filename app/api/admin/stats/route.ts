import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [totalUsers, totalProperties, totalBookings, totalReviews, pendingBookings, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.property.count(),
      prisma.booking.count(),
      prisma.review.count(),
      prisma.booking.count({
        where: { status: "pending" },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
    ])

    const usersByRole = await prisma.user.groupBy({
      by: ["role"],
      _count: {
        role: true,
      },
    })

    const bookingsByStatus = await prisma.booking.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    })

    const stats = {
      totalUsers,
      totalProperties,
      totalBookings,
      totalReviews,
      pendingBookings,
      usersByRole: usersByRole.reduce(
        (acc, item) => {
          acc[item.role] = item._count.role
          return acc
        },
        {} as Record<string, number>,
      ),
      bookingsByStatus: bookingsByStatus.reduce(
        (acc, item) => {
          acc[item.status] = item._count.status
          return acc
        },
        {} as Record<string, number>,
      ),
      recentUsers,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
