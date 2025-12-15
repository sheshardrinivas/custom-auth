"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import Image from "next/image";

export default function Results() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    async function fetchVotes() {
      try {
        const { data: candidateData, error: candidateError } = await supabase
          .from("candidates")
          .select("*");

        if (candidateError) {
          console.error("Error fetching candidates:", candidateError);
          return;
        }

        const { data: votesData, error: votesError } = await supabase
          .from("votes")
          .select("*");

        if (votesError) {
          console.error("Error fetching votes:", votesError);
          return;
        }

        const merged = candidateData.map((c: any) => {
          const voteRow = votesData.find(
            (v: any) => v.student_name === c.name && v.role === c.role,
          );
          return {
            ...c,
            votes: voteRow ? voteRow.votes : 0,
          };
        });

        const total = merged.reduce((acc, c) => acc + (c.votes || 0), 0);

        setCandidates(merged);
        setTotalVotes(total);
      } catch (err) {
        console.error(err);
      }
    }

    fetchVotes();
  }, []);

  return (
    <div className="flex h-screen w-screen bg-gray-900 text-amber-100">
      <div className="flex flex-col items-center w-64 bg-gray-800 p-6 gap-6">
        <button
          className="text-4xl hover:text-amber-300 transition-colors"
          onClick={() => router.push("/admin/new_candidate")}
        >
          ➣
        </button>

        <h1 className="text-2xl font-bold text-center">Results</h1>
        <p className="mt-4 font-medium">Total Votes: {totalVotes}</p>
      </div>

      <div className="flex-1 p-6 overflow-y-scroll flex flex-col items-center gap-4">
        {candidates.length > 0 ? (
          candidates.map((c) => {
            const percentage = totalVotes ? (c.votes / totalVotes) * 100 : 0;
            return (
              <div
                key={`${c.name}-${c.role}`}
                className="w-full max-w-3xl px-4 py-3 mb-2 rounded-md border border-amber-400/30
                           bg-amber-400/10 flex items-center gap-4"
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-amber-400/40">
                  <Image
                    src={c.image || "/placeholder.jpg"}
                    alt={c.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{c.name}</span>
                    <span>{c.votes} votes</span>
                  </div>
                  <div className="flex gap-3 text-sm text-amber-200/80 mb-2">
                    <span className="px-2 py-1 rounded bg-amber-500/10">
                      Grade: {c.grade || "N/A"}
                    </span>
                    <span className="px-2 py-1 rounded bg-amber-500/10">
                      Role: {c.role}
                    </span>
                  </div>
                  <div className="bg-gray-700 h-6 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-6 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-400">No vote data available.</p>
        )}
      </div>
    </div>
  );
}
