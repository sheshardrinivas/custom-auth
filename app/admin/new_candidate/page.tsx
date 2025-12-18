"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import Image from "next/image";
import { allRoles } from "@/app/lib/role";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
export default function NewCandidatePage() {
  const router = useRouter();

  const [currentRole, setCurrentRole] = useState(allRoles[0]);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");

  const [role_, setRole_] = useState(allRoles[0]);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  useGSAP(() => {
    gsap.to(".box", {
      duration: 0.8,
      opacity: 1,
      width: "18rem",
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
  async function add_votes_list(name: string, role: string, grade: number) {
    await supabase
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

    const { error } = await supabase
      .from("candidates")
      .insert([{ name, grade, role, image: imageUrl }]);

    await add_votes_list(name, role, grade);

    if (error) {
      console.error("Error adding candidate:", error);
    } else {
      alert("Candidate added successfully!");
      setName("");
      setGrade("");
      setRole_(allRoles[0]);
      setImageUrl(null);
      setImagePreview(null);
    }
  }

  async function upload(file: File): Promise<string> {
    const { data, error } = await supabase.storage
      .from("images")
      .upload(`uploads/${Date.now()}-${file.name}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;
    return data.path;
  }

  function getURL(path: string): string {
    return supabase.storage.from("images").getPublicUrl(path).data.publicUrl;
  }

  async function upload_file(file: File) {
    setUploading(true);

    setImagePreview(URL.createObjectURL(file));

    const path = await upload(file);
    const url = getURL(path);

    setImageUrl(url);
    setImagePreview(url);

    setUploading(false);
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    upload_file(file);
  };

  const handleSubmit = async () => {
    if (uploading) return;

    if (!imageUrl) {
      alert("Please upload an image first");
      return;
    }

    await addCandidate(name, Number(grade), role_, imageUrl);
  };

  return (
    <div className="flex h-screen w-screen bg-gray-900 text-amber-100">
      <div className="flex flex-col w-0 opacity-0 box bg-gray-800 p-4 gap-6 relative">
        <button
          className="text-4xl hover:text-amber-300 transition-colors absolute top-4 left-4 opacity-0 text"
          onClick={() => router.push("/admin/candidates")}
        >
          ➣
        </button>

        <div className="flex flex-col items-center justify-center h-full gap-4">
          <h1 className="text-2xl font-bold text-center opacity-0 text">
            Add Candidate
          </h1>

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-md p-2 w-0 opacity-0 text-white outline-none input"
          />

          <input
            type="number"
            placeholder="Grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-md p-2 w-0 opacity-0 text-white outline-none input"
          />

          <select
            value={role_}
            onChange={(e) => setRole_(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-md p-2 w-0 opacity-0 text-white outline-none input"
          >
            {allRoles.map((role) => (
              <option key={role}>{role}</option>
            ))}
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="bg-gray-700 border border-gray-600 rounded-md p-2 w-0 opacity-0 text-white outline-none input"
          />

          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="px-4 py-2 w-full text  opacity-0 rounded-md bg-amber-400 hover:bg-amber-500 text-gray-900 transition-colors disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Add Candidate"}
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center gap-4 overflow-y-scroll">
        <h2 className="text-2xl font-bold mb-4">Candidate Preview</h2>

        {name || grade || role_ ? (
          <div className="w-full max-w-3xl px-4 py-3 mb-2 rounded-md border border-amber-400/30 bg-amber-400/10 flex flex-col gap-2">
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
