"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    // Redirect to login if not signed in
    router.push("/login");
    return null;
  }

  return (
    <div className="container h-[93vh] flex flex-col justify-center items-center mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <p>
        <strong>Name:</strong> {session.user?.name}
      </p>
      <p>
        <strong>Email:</strong> {session.user?.email}
      </p>
      {session.user?.image && (
        <img
          src={session.user.image}
          alt="Profile Image"
          className="w-32 h-32 rounded-full mt-4"
        />
      )}
      <button
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        onClick={() => signOut()}
      >
        Sign Out
      </button>
    </div>
  );
}
