import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    landlordId,
    title,
    description,
    address,
    city,
    postalCode,
    rent,
    availableFrom,
    images,
  } = body;

  const property = await prisma.property.create({
    data: {
      landlordId: landlordId || 1,
      title,
      description,
      address,
      city,
      postalCode,
      rent: Number(rent),
      availableFrom: new Date(availableFrom),
      images: {
        create: images?.map((url: string) => ({ imageUrl: url })) || [],
      },
    },
    include: { images: true },
  });

  return NextResponse.json(property);
}

export async function GET(req: Request) {
  try {
    const properties = await prisma.property.findMany({
      take: 10, // limit
      orderBy: { createdAt: "desc" },
      include: {
        images: { select: { imageUrl: true } },
      },
    });

    return new Response(JSON.stringify(properties), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch properties" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
