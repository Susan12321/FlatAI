"use client";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PropertyDetailsPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto mt-4">
      <div>
        <button
          onClick={() => router.push("/")}
          className="flex items-center justify-center text-sm text-gray-700 gap-2 cursor-pointer"
        >
          <ChevronLeft size={20} />
          Home
        </button>
      </div>
    </div>
  );
}
