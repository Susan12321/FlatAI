import { Property } from "@/types/property";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type PropertyCardProps = {
  property: Property;
};

export default function PropertyCard({ property }: PropertyCardProps) {
  const mainImage = property.images?.[0]?.imageUrl || "/placeholder.png";

  return (
    <Link href={`/property/${property.id}`}>
      <div className="group cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="relative w-full h-52 overflow-hidden">
          <img
            src={mainImage}
            alt={property.title}
            // fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* for contentttt */}
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-800">
            {property.title}
          </h3>
          <p className="text-gray-500 text-sm">{property.city}</p>

          {/* for ratingsss */}
          <div className="flex items-center mt-2 text-yellow-500">
            <Star size={16} fill="currentColor" className="mr-1" />
            <span className="text-sm font-medium">{property.rating || 0}</span>
            <span className="text-gray-400 text-sm ml-1">
              ({property.reviews || 0} reviews)
            </span>
          </div>

          {/* for pricesss */}
          <p className="text-blue-800 font-bold text-lg mt-3">
            ${property.rent.toLocaleString()}
            <span className="text-sm text-gray-800"> / month</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
