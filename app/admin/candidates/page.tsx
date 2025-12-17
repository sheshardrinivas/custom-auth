"use client";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { useState, useEffect, SetStateAction } from "react";
import Image from "next/image";
import { allRoles } from "@/app/lib/role";

export default function Admin() {
  const router = useRouter();

  const [currentRole, setCurrentRole] = useState(allRoles[0]);
  function logout() {
    fetch("/api/logout", { method: "POST" })
      .then((response) => response.json())
      .then((data) => {
        if (data.logout) {
          router.push("/login");
        }
      });
  }
  interface CandidatesProps {
    id: number;
    name: string;
    grade: number;
    role: string;
    image: string;
  }
  const [data, setData] = useState<CandidatesProps[]>([]);

  // async function getUserData(query: string) {
  //   const { data } = await supabase
  //     .from("candidates")
  //     .select("*")
  //     .eq("role", query);

  //   setData(data);
  // }
  const getCandidates = async () => {
    console.log(currentRole);
    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .eq("role", currentRole);

    if (error) {
      console.error("Error fetching candidates:", error);
      return [];
    }

    return data || [];
  };

  useEffect(() => {
    getCandidates().then((candidates) => {
      setData(candidates);
    });
  }, [currentRole]);

  return (
    <div className="flex h-screen w-screen bg-gray-900">
      <div className="flex flex-col items-center w-56 bg-gray-800 text-amber-100 p-4 gap-6">
        <span className=" flex flex-row gap-8">
          <button
            className="text-4xl hover:text-amber-300 transition-colors rotate-180"
            onClick={logout}
          >
            ➣
          </button>
          <button
            className="text-4xl hover:text-amber-300 transition-colors "
            onClick={() => router.push("/admin/results")}
          >
            ➣
          </button>
        </span>

        <h1 className="text-xl font-semibold text-center">Candidates List</h1>

        {/*<input
          type="text"
          placeholder="Search"
          className="bg-gray-700 border border-gray-600 rounded-md p-2 w-full outline-none focus:outline-none focus:ring-0 text-white placeholder-gray-400"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const query = e?.target?.value;
              getUserData(query);
            }
          }}
        />*/}
        <select
          value={currentRole}
          onChange={(e) => setCurrentRole(e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded-md p-2 w-full text-white outline-none"
        >
          {allRoles.map((role) => (
            <option key={role}>{role}</option>
          ))}
        </select>
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
