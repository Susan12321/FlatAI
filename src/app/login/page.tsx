"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // If login is successful
      localStorage.setItem("token", data.token); // store JWT
      router.push("/"); // redirect to home
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex  h-[93vh] justify-center items-center bg-gray-100 px-2 md:px-0">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md px-6 py-12 rounded-md bg-white shadow-lg"
        >
          <h1 className="text-2xl font-semibold text-gray-700 text-center">
            Login
          </h1>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}

          <div className="w-full mt-3">
            <label
              className="block text-base text-gray-700 font-semibold"
              htmlFor="email"
            >
              Email
            </label>
            <input
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="border outline-none border-gray-200 px-1 py-2 w-full rounded-md mt-1"
              type="email"
            />
          </div>

          <div className="w-full mt-3">
            <label
              className="block text-base text-gray-700 font-semibold"
              htmlFor="password"
            >
              Password
            </label>
            <input
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="border outline-none border-gray-200 px-1 py-2 w-full rounded-md mt-1"
              type="password"
            />
          </div>

          <p className="text-center text-sm text-gray-600 mt-3">
            Don't have an account?
            <Link href="/signup" className="text-blue-600 hover:underline ml-1">
              Sign up
            </Link>
          </p>

          <div className="mt-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 w-full py-2 bg-blue-700 hover:bg-blue-900 font-semibold text-base text-white rounded-md disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
