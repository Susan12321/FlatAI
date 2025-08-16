"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function SignInButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <button
        className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => signOut()}
      >
        Sign out
      </button>
    );
  }

  return (
    <button
      className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
      onClick={() => signIn("google")}
    >
      Sign in with Google
    </button>
  );
}
