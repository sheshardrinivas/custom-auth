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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: name.current?.value ?? "",
        password: password.current?.value ?? "",
      }),
    });
    const data = await response.json();
    if (data?.auth) {
      router.push("/admin");
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center  p-2 font-sans bg-background  ">
      <div className="border-zinc-600 border-2 w-10/40 h-42/100 grid  grid-rows-4 grid-cols-2 p-6 items-center justify-center rounded-xl">
        <p className="col-span-2 row-start-1 text-center">LOGIN</p>
        <input
          type="text"
          ref={name}
          placeholder="Username"
          className="border border-gray-300 rounded-md px-4 py-2 w-full outline-none col-span-2 row-start-2"
        />
        <div className="relative col-span-2 row-start-3">
          <input
            type={showPassword ? "text" : "password"}
            ref={password}
            placeholder="password"
            className="border border-gray-300 rounded-md px-4 py-2 w-full pr-28 outline-none"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-lg text-gray-500"
          >
            {showPassword ? "◉" : "◎"}
          </button>
        </div>
        <button
          type="submit"
          className="col-span-2 row-start-4 bg-zinc-600 text-white rounded-md px-4 py-2 w-full outline-none"
          onClick={login}
        >
          Login
        </button>
      </div>
    </div>
  );
}
