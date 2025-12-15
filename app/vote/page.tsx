"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import Image from "next/image";

const allRoles = ["headboy", "the biggest brid"];

export default function VotingUI() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [currentRole, setCurrentRole] = useState(allRoles[0]);

  const getCandidates = async () => {
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
  async function get_current_votes(name, role) {
    const { data, error } = await supabase
      .from("votes")
      .select("votes")
      .eq("student_name", name)
      .eq("role", role)
      .single();
    return data?.votes || 0;
  }
  async function vote(name: string, role: string) {
    const current_votes = await get_current_votes(name, role);
    const { data } = await supabase
      .from("votes")
      .update({ votes: current_votes + 1 })
      .eq("student_name", name)
      .eq("role", role);
  }

  useEffect(() => {
    getCandidates().then(setCandidates);
  }, [currentRole]);

  return (
    <div className="flex h-screen w-screen bg-gray-900 text-amber-100">
      <div className="flex flex-col items-center w-64 bg-gray-800 p-6 gap-6">
        <h1 className="text-2xl font-bold text-center">Voting</h1>

        <input
          placeholder="Name"
          className="bg-gray-700 border border-gray-600 rounded-md p-2 w-full text-white outline-none"
        />
        <input
          placeholder="Grade"
          className="bg-gray-700 border border-gray-600 rounded-md p-2 w-full text-white outline-none"
        />
        <input
          placeholder="Section"
          className="bg-gray-700 border border-gray-600 rounded-md p-2 w-full text-white outline-none"
        />

        <p className="text-center font-medium">
          Current Role: <span className="text-amber-400">{currentRole}</span>
        </p>

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

      <div className="flex-1 p-6 overflow-y-scroll flex flex-col items-center gap-4">
        {candidates.map((c) => (
          <div
            key={c.id}
            className="w-full max-w-3xl px-4 py-3 mb-2 rounded-md border border-amber-400/30
                       bg-amber-400/10 hover:bg-amber-400/20 transition-colors
                       flex items-center gap-4"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-amber-400/40">
              <Image
                src={c.image || "/placeholder.jpg"}
                alt={c.name}
                fill
                className="object-cover"
              />
            </div>

            <span className="font-medium flex-1">{c.name}</span>

            <div className="flex gap-3 text-sm text-amber-200/80">
              <span className="px-2 py-1 rounded bg-amber-500/10">
                Grade: {c.grade || "N/A"}
              </span>
              <span className="px-2 py-1 rounded bg-amber-500/10">
                Role: {c.role}
              </span>
            </div>

            <button
              className="px-4 py-2 rounded-md bg-amber-400 hover:bg-amber-500 text-gray-900 transition-colors"
              onClick={() => vote(c.name, c.role)}
            >
              Vote
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
