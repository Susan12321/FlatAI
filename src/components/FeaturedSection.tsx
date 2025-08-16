"use client";

import { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";
import Title from "./Title";
import { Property } from "@/types/property"; // import your type

export default function FeaturedSection() {
  const [properties, setProperties] = useState<Property[]>([]); // <- type here

  useEffect(() => {
    fetch("/api/properties")
      .then((res) => res.json())
      .then((data: Property[]) => setProperties(data)) // ensure type
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <Title
          title="Featured Properties"
          subtitle="Discover our top properties"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}
