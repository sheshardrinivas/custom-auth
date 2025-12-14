"use client";
import { useRouter } from "next/navigation";

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
    <div className="flex flex-col items-center justify-center h-screen w-screen gap-8">
      admin page
      <button
        onClick={logout}
        className=" border-2 border-stone-500 p-2 rounded-xl"
      >
        Logout
      </button>
    </div>
  );
}
