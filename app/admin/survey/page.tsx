"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function AddQuestionPage() {
    const router = useRouter();

    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState<string[]>(["", "", "", ""]);
    const [loading, setLoading] = useState(false);

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

    const updateOption = (index: number, value: string) => {
        const copy = [...options];
        copy[index] = value;
        setOptions(copy);
    };

    async function addQuestion() {
        if (!question || options.some((o) => !o)) {
            alert("Fill all fields");
            return;
        }

        setLoading(true);

        const { data, error } = await supabase
            .from("questions")
            .insert([
                {
                    question,
                    option_a: options[0],
                    option_b: options[1],
                    option_c: options[2],
                    option_d: options[3],
                },
            ])
            .select()
            .single();

        if (!error && data) {
            await supabase.from("votes").insert({
                question_id: data.id,
                vote_a: 0,
                vote_b: 0,
                vote_c: 0,
                vote_d: 0,
            });
        }

        setLoading(false);

        if (error) {
            alert("Error adding question");
        } else {
            alert("Question added");
            setQuestion("");
            setOptions(["", "", "", ""]);
        }
    }

    return (
        <div className="flex h-screen w-screen bg-gray-900 text-amber-100">
            <div className="flex flex-col w-0 opacity-0 box bg-gray-800 p-4 gap-6 relative">
                <button
                    className="text-4xl hover:text-amber-300 transition-colors absolute top-4 left-4 opacity-0 text"
                    onClick={() => router.push("/admin/survey/results")}
                >
                    ➣
                </button>

                <div className="flex flex-col items-center justify-center h-full gap-4">
                    <h1 className="text-2xl font-bold text-center opacity-0 text">
                        Add Question
                    </h1>

                    <input
                        type="text"
                        placeholder="Question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="bg-gray-700 border border-gray-600 rounded-md p-2 w-0 opacity-0 text-white outline-none input"
                    />

                    {options.map((opt, i) => (
                        <input
                            key={i}
                            type="text"
                            placeholder={`Option ${i + 1}`}
                            value={opt}
                            onChange={(e) => updateOption(i, e.target.value)}
                            className="bg-gray-700 border border-gray-600 rounded-md p-2 w-0 opacity-0 text-white outline-none input"
                        />
                    ))}

                    <button
                        onClick={addQuestion}
                        disabled={loading}
                        className="px-4 py-2 w-full text opacity-0 rounded-md bg-amber-400 hover:bg-amber-500 text-gray-900 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Add Question"}
                    </button>
                </div>
            </div>

            <div className="flex-1 p-6 flex flex-col items-center gap-4 overflow-y-scroll">
                <h2 className="text-2xl font-bold mb-4">Preview</h2>

                {question ? (
                    <div className="w-full max-w-3xl px-4 py-3 rounded-md border border-amber-400/30 bg-amber-400/10 flex flex-col gap-3">
                        <h3 className="font-medium text-lg">{question}</h3>
                        <ul className="grid grid-cols-2 gap-2">
                            {options.map((opt, i) => (
                                <li
                                    key={i}
                                    className="px-3 py-2 rounded bg-gray-800 border border-gray-700"
                                >
                                    {opt || `Option ${i + 1}`}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className="text-gray-400">Fill inputs to preview the question.</p>
                )}
            </div>
        </div>
    );
}
