"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
export default function Admin() {
  const router = useRouter();
  function logout() {
    fetch("/api/logout", { method: "POST" })
      .then((response) => response.json())
      .then((data) => {
        if (data.logout) {
          router.push("/login");
        }
      });
  }
  return (
    <div className="grid grid-cols-20 grid-rows-20 items-center justify-center h-screen w-screen gap-8">
      <div className="bg-transparent row-end-1  col-span-2 grid grid-rows-1 grid-cols-1 items-center justify-center p-2">
        <p
          className="text-4xl text-gray-500 row-start-1 col-span-1 text-center rotate-180 "
          onClick={logout}
        >
          ➣
        </p>
      </div>
    </div>
  );
}
