"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "USER" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[93vh] justify-center items-center bg-gray-100 px-2 md:px-0">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md px-6 py-12 rounded-md bg-white shadow-lg"
      >
        <h1 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Register
        </h1>

        {error && (
          <p className="text-red-600 text-center mb-4 font-medium">{error}</p>
        )}

        <div className="w-full mt-3">
          <label className="block text-base text-gray-700 font-semibold">
            Name:
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border outline-none border-gray-200 px-1 py-2 w-full rounded-md mt-1"
            type="text"
          />
        </div>

        <div className="w-full mt-3">
          <label className="block text-base text-gray-700 font-semibold">
            Email:
          </label>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border outline-none border-gray-200 px-1 py-2 w-full rounded-md mt-1"
            type="email"
          />
        </div>

        <div className="w-full mt-3">
          <label className="block text-base text-gray-700 font-semibold">
            Password:
          </label>
          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border outline-none border-gray-200 px-1 py-2 w-full rounded-md mt-1"
            type="password"
          />
        </div>

        <div className="w-full mt-3">
          <label className="block text-base text-gray-700 font-semibold">
            Confirm Password:
          </label>
          <input
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border outline-none border-gray-200 px-1 py-2 w-full rounded-md mt-1"
            type="password"
          />
        </div>

        <p className="text-center text-sm text-gray-600 mt-3">
          Already have an account?
          <Link href="/login" className="text-blue-600 hover:underline ml-1">
            Login
          </Link>
        </p>

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="px-6 w-full py-2 bg-blue-700 hover:bg-blue-900 font-semibold text-base text-white rounded-md disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
}
