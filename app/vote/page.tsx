"use client";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/app/lib/supabase";
import Image from "next/image";
import { allRoles } from "@/app/lib/role";

gsap.registerPlugin(useGSAP);
export default function VotingUI() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [currentRole, setCurrentRole] = useState(allRoles[0]);
  const [voted, setVoted] = useState<boolean>(false);
  const name_input = useRef<HTMLInputElement>(null);
  const grade = useRef<HTMLInputElement>(null);
  const section = useRef<HTMLInputElement>(null);

  useGSAP(() => {
    gsap.to(".box", {
      duration: 0.8,
      opacity: 1,
      width: "16rem",
      stagger: 0.2,
    });
    gsap.to(".input", {
      duration: 0.6,
      opacity: 1,
      width: "100%",
      stagger: 0.2,
      delay: 1.0,
    });
    gsap.to(".text", {
      duration: 0.4,
      opacity: 1,

      stagger: 0.2,
      delay: 1.8,
    });
  });
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
  async function get_current_votes(name: string, role: string) {
    const { data, error } = await supabase
      .from("votes")
      .select("votes")
      .eq("student_name", name)
      .eq("role", role)
      .single();
    return data?.votes || 0;
  }

  async function does_name_exist() {
    const { data, error } = await supabase
      .from("students")
      .select("voted")
      .eq("full_name", name_input?.current?.value)
      .eq("grade", grade?.current?.value)
      .single();
    return data?.voted;
  }

  async function vote(name: string, role: string) {
    const current_votes = await get_current_votes(name, role);
    const voted_ = await does_name_exist();
    console.log(voted_);
    if (!voted_) {
      await supabase
        .from("students")
        .update({ voted: true })
        .eq("full_name", name_input?.current?.value);

      const { data } = await supabase
        .from("votes")
        .update({ votes: current_votes + 1 })
        .eq("student_name", name)
        .eq("role", role);
      alert("Vote successful!");
    } else {
      alert("already voted");
    }
  }

  useEffect(() => {
    getCandidates().then(setCandidates);
  }, [currentRole]);

  return (
    <div className="flex h-screen w-screen bg-gray-900 text-amber-100">
      <div className="flex flex-col items-center w-0 opacity-0 bg-gray-800 p-6 gap-6 box">
        <h1 className="text-2xl font-bold text-center opacity-0 text ">
          Voting
        </h1>

        <input
          placeholder="Name"
          ref={name_input}
          className="bg-gray-700 border border-gray-600 rounded-md p-2 w-0 text-white outline-none opacity-0 input"
        />
        <input
          placeholder="Grade"
          ref={grade}
          className="bg-gray-700 border border-gray-600 rounded-md p-2 w-0 text-white outline-none opacity-0 input"
        />
        <input
          placeholder="Section"
          ref={section}
          className="bg-gray-700 border border-gray-600 rounded-md p-2 w-0 text-white outline-none opacity-0 input"
        />

        <p className="text-center font-medium  opacity-0 text">
          Current Role: <span className="text-amber-400">{currentRole}</span>
        </p>

        <select
          value={currentRole}
          onChange={(e) => {
            setCurrentRole(e.target.value);
            setVoted(false);
          }}
          className="bg-gray-700 border border-gray-600 rounded-md p-2 w-0 text-white outline-none input opacity-0 "
        >
          {allRoles.map((role) => (
            <option key={role}>{role}</option>
          ))}
        </select>
      </div>

      <div className="flex-1  p-4 overflow-y-scroll flex flex-col items-center gap-4">
        {candidates.map((c) => (
          <div
            key={c.id}
            className="w-full max-w-6xl px-4 py-8 mb-2 rounded-md border border-amber-400/30
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
              disabled={voted}
              className="px-4 py-2  font-bold rounded-md bg-slate-300 hover:bg-slate-400 text-gray-900 transition-colors"
              key={c.name + c.role}
              onClick={() => {
                vote(c.name, c.role);

                setVoted(true);
              }}
            >
              Vote
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
