"use client";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { useState } from "react";
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

  const [data, setData] = useState([]);

  async function getUserData(query: string) {
    const { data } = await supabase
      .from("candidates")
      .select("*")
      .eq("role", query);

    setData(data);
  }

  return (
    <div className="flex h-screen w-screen bg-gray-900">
      <div className="flex flex-col items-center w-56 bg-gray-800 text-amber-100 p-4 gap-6">
        <button
          className="text-4xl hover:text-amber-300 transition-colors"
          onClick={logout}
        >
          ➣
        </button>

        <h1 className="text-xl font-semibold text-center">Candidates List</h1>

        <button
          onClick={() => router.push("/admin/results")}
          className="px-4 py-2 rounded-md border border-amber-400/40
                     bg-amber-400/10 text-amber-100
                     hover:bg-amber-400/20 transition-colors w-full text-center"
        >
          View Results
        </button>

        <input
          type="text"
          placeholder="Search"
          className="bg-gray-700 border border-gray-600 rounded-md p-2 w-full outline-none focus:outline-none focus:ring-0 text-white placeholder-gray-400"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const query = e?.target?.value;
              getUserData(query);
            }
          }}
        />
      </div>

      <div className="flex-1 p-6 overflow-y-scroll">
        {data && data.length > 0 ? (
          data.map((item) => (
            <div
              key={item.id}
              className="w-full max-w-3xl px-4 py-3 mb-4 rounded-md border border-amber-400/30
                         bg-amber-400/10 hover:bg-amber-400/20 transition-colors
                         flex items-center gap-4 text-amber-100"
            >
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-amber-400/40">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              <span className="font-medium flex-1">{item.name}</span>

              <div className="flex gap-3 text-sm text-amber-200/80">
                <span className="px-2 py-1 rounded bg-amber-500/10">
                  Grade: {item.grade}
                </span>
                <span className="px-2 py-1 rounded bg-amber-500/10">
                  Role: {item.role}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No candidates found</p>
        )}
      </div>
    </div>
  );
}
