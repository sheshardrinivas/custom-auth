"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import Image from "next/image";

export default function NewCandidatePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [role, setRole] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handle candidate addition
  async function addCandidate(
    name: string,
    grade: number,
    role: string,
    imageUrl?: string,
  ) {
    // Check if candidate already exists
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

    // Insert candidate
    const { data, error } = await supabase
      .from("candidates")
      .insert([{ name, grade, role, image: imageUrl }]);

    if (error) {
      console.error("Error adding candidate:", error);
    } else {
      alert("Candidate added successfully!");
      setName("");
      setGrade("");
      setRole("");
      setImage(null);
      setImagePreview(null);
    }
  }

  // Handle image selection
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
    if (image) {
      // Upload to Supabase storage (optional)
      const fileExt = image.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from("candidates")
        .upload(fileName, image);
      if (error) {
        console.error("Error uploading image:", error);
      } else {
        const { publicURL } = supabase.storage
          .from("candidates")
          .getPublicUrl(fileName);
        imageUrl = publicURL;
      }
    }

    addCandidate(
      name,
      Number(grade),
      role,
      imageUrl || imagePreview || undefined,
    );
  };

  return (
    <div className="flex h-screen w-screen bg-gray-900 text-amber-100">
      {/* Dock */}
      <div className="flex flex-col w-64 bg-gray-800 p-6 gap-6 relative">
        {/* Back Button */}
        <button
          className="text-4xl hover:text-amber-300 transition-colors absolute top-4 left-4"
          onClick={() => router.push("/admin/candidates")}
        >
          ➣
        </button>

        {/* Centered Inputs */}
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
          <input
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-md p-2 w-full text-white outline-none"
          />
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

      {/* Right side preview */}
      <div className="flex-1 p-6 flex flex-col items-center gap-4 overflow-y-scroll">
        <h2 className="text-2xl font-bold mb-4">Candidate Preview</h2>

        {name || grade || role ? (
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
                Role: {role || "N/A"}
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
