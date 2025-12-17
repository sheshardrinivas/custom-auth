"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import Image from "next/image";
import { allRoles } from "@/app/lib/role";

export default function NewCandidatePage() {
  const router = useRouter();

  const [currentRole, setCurrentRole] = useState(allRoles[0]);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");

  const [role_, setRole_] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  async function add_votes_list(name: string, role: string, grade: number) {
    const { data } = await supabase
      .from("votes")
      .insert({ student_name: name, grade: grade, role: role, votes: 0 });
  }

  async function addCandidate(
    name: string,
    grade: number,
    role: string,
    imageUrl?: string,
  ) {
    const { data: existing, error: checkError } = await supabase
      .from("candidates")
      .select("*")
      .eq("name", name)
      .eq("grade", grade)
      .eq("role", role)
      .limit(1);

    if (checkError) {
      console.error("Error checking candidate:", checkError);
      return;
    }

    if (existing && existing.length > 0) {
      alert("Candidate already exists!");
      return;
    }

    const { data, error } = await supabase
      .from("candidates")
      .insert([{ name, grade, role, image: imageUrl }]);
    add_votes_list(name, role, grade);

    if (error) {
      console.error("Error adding candidate:", error);
    } else {
      alert("Candidate added successfully!");
      setName("");
      setGrade("");
      setRole_("");
      setImage(null);
      setImagePreview(null);
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle submit
  const handleSubmit = async () => {
    let imageUrl = null;

    addCandidate(
      name,
      Number(grade),
      role_,
      imageUrl || imagePreview || undefined,
    );
  };

  return (
    <div className="flex h-screen w-screen bg-gray-900 text-amber-100">
      <div className="flex flex-col w-72 bg-gray-800 p-4 gap-6 relative">
        <button
          className="text-4xl hover:text-amber-300 transition-colors absolute top-4 left-4"
          onClick={() => router.push("/admin/candidates")}
        >
          ➣
        </button>

        <div className="flex flex-col items-center justify-center h-full gap-4">
          <h1 className="text-2xl font-bold text-center">Add Candidate</h1>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-md p-2 w-full text-white outline-none"
          />
          <input
            type="number"
            placeholder="Grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-md p-2 w-full text-white outline-none"
          />

          {/*<input
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-md p-2 w-full text-white outline-none"
          />*/}
          <select
            value={role_}
            onChange={(e) => setRole_(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-md p-2 w-full text-white outline-none"
          >
            {allRoles.map((role) => (
              <option key={role}>{role}</option>
            ))}
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="bg-gray-700 border border-gray-600 rounded-md p-2 w-full text-white outline-none"
          />
          <button
            onClick={handleSubmit}
            className="px-4 py-2 w-full rounded-md bg-amber-400 hover:bg-amber-500 text-gray-900 transition-colors"
          >
            Add Candidate
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center gap-4 overflow-y-scroll">
        <h2 className="text-2xl font-bold mb-4">Candidate Preview</h2>

        {name || grade || role_ ? (
          <div
            className="w-full max-w-3xl px-4 py-3 mb-2 rounded-md border border-amber-400/30
                          bg-amber-400/10 flex flex-col gap-2"
          >
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-amber-400/40 bg-gray-700">
                {imagePreview && (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <span className="font-medium text-lg">{name || "Name"}</span>
            </div>

            <div className="flex gap-3 text-sm text-amber-200/80">
              <span className="px-2 py-1 rounded bg-amber-500/10">
                Grade: {grade || "N/A"}
              </span>
              <span className="px-2 py-1 rounded bg-amber-500/10">
                Role: {role_ || "N/A"}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">
            Fill in the inputs to preview the candidate here.
          </p>
        )}
      </div>
    </div>
  );
}
