"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";

export default function SurveyResults() {
    const router = useRouter();
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        async function fetchResults() {
            const { data } = await supabase.from("survey").select("*");
            setData(data || []);
        }
        fetchResults();
    }, []);

    return (
        <div className="flex h-screen w-screen bg-gray-900 text-amber-100">
            <div className="w-64 bg-gray-800 p-6 flex flex-col gap-6">
                <button
                    className="text-4xl hover:text-amber-300 rotate-180"
                    onClick={() => router.push("/admin/survey")}
                >
                    ➣
                </button>
                <h1 className="text-2xl font-bold text-center">Survey Results</h1>
            </div>

            <div className="flex-1 p-6 overflow-y-scroll flex flex-col gap-6">
                {data.map((q) => {
                    const total =
                        q.vote_a + q.vote_b + q.vote_c + q.vote_d || 1;

                    const options = [
                        { text: q.option_a, votes: q.vote_a },
                        { text: q.option_b, votes: q.vote_b },
                        { text: q.option_c, votes: q.vote_c },
                        { text: q.option_d, votes: q.vote_d },
                    ];

                    return (
                        <div
                            key={q.id}
                            className="max-w-4xl w-full border border-amber-400/30 bg-amber-400/10 p-6 rounded"
                        >
                            <h2 className="text-xl font-semibold mb-4">
                                {q.question}
                            </h2>

                            {options.map((o, i) => {
                                const percent = (o.votes / total) * 100;
                                return (
                                    <div key={i} className="mb-3">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>{o.text}</span>
                                            <span>{o.votes}</span>
                                        </div>
                                        <div className="bg-gray-700 h-5 rounded-full overflow-hidden">
                                            <div
                                                className="bg-amber-400 h-5"
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
