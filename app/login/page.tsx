"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const name = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function login() {
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: name.current?.value ?? "",
        password: password.current?.value ?? "",
      }),
    });
    const data = await response.json();
    if (data?.auth) {
      if (name.current?.value === "admin") {
        router.push("/admin/candidates");
      } else {
        router.push("/teacher/new_candidate");
      }
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-900 font-sans">
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-xl w-96 p-8 flex flex-col gap-6">
        <h1 className="text-2xl text-amber-100 font-semibold text-center">
          LOGIN
        </h1>

        <input
          type="text"
          ref={name}
          placeholder="Username"
          className="border border-gray-600 rounded-md px-4 py-2 w-full bg-gray-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-400"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            ref={password}
            placeholder="Password"
            className="border border-gray-600 rounded-md px-4 py-2 w-full pr-12 bg-gray-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-400 hover:text-amber-400 transition-colors"
          >
            {showPassword ? "◉" : "◎"}
          </button>
        </div>

        <button
          type="submit"
          onClick={login}
          className="bg-amber-400 text-gray-900 font-semibold rounded-md px-4 py-2 w-full hover:bg-amber-500 transition-colors"
        >
          Login
        </button>

        <p className="text-gray-400 text-center text-sm">
          Enter your credentials to access the admin panel
        </p>
      </div>
    </div>
  );
}
