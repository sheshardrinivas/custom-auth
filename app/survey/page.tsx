"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type VoteKey = "vote_a" | "vote_b" | "vote_c" | "vote_d";

type SurveyRow = {
    id: number;
    question: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    vote_a: number;
    vote_b: number;
    vote_c: number;
    vote_d: number;
};

export default function Survey() {
    const [questions, setQuestions] = useState<SurveyRow[]>([]);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [submitting, setSubmitting] = useState(false);

    useGSAP(() => {
        gsap.to(".sidebar", {
            width: "16rem",
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
        });

        gsap.to(".title", {
            opacity: 1,
            y: 0,
            delay: 0.4,
            duration: 0.5,
        });

        gsap.to(".submit", {
            opacity: 1,
            y: 0,
            delay: 0.6,
            duration: 0.5,
        });

        gsap.to(".card", {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            delay: 0.8,
            duration: 0.5,
            ease: "power2.out",
        });
    }, [questions]);

    useEffect(() => {
        async function getQuestions() {
            const { data } = await supabase.from("survey").select("*");
            if (data) setQuestions(data);
        }
        getQuestions();
    }, []);

    const allAnswered =
        questions.length > 0 && questions.every((q) => answers[q.id]);

    async function submitSurvey() {
        if (!allAnswered || submitting) return;
        setSubmitting(true);

        for (const q of questions) {
            const selected = answers[q.id];

            let voteColumn: VoteKey;
            if (selected === q.option_a) voteColumn = "vote_a";
            else if (selected === q.option_b) voteColumn = "vote_b";
            else if (selected === q.option_c) voteColumn = "vote_c";
            else voteColumn = "vote_d";

            const { data } = await supabase
                .from("survey")
                .select(voteColumn)
                .eq("id", q.id)
                .single();

            if (!data) {
                setSubmitting(false);
                return;
            }

            const newValue =
                (data as Record<VoteKey, number>)[voteColumn] + 1;

            const { error } = await supabase
                .from("survey")
                .update({ [voteColumn]: newValue })
                .eq("id", q.id);

            if (error) {
                setSubmitting(false);
                return;
            }
        }

        setSubmitting(false);
        alert("Survey submitted successfully!");
    }

    return (
        <div className="flex h-screen w-screen bg-gray-900 text-amber-100">
            <div className="flex flex-col items-center w-0 opacity-0 bg-gray-800 p-6 gap-6 sidebar">
                <h1 className="text-2xl font-bold text-center opacity-0 translate-y-4 title">
                    Survey
                </h1>

                <button
                    onClick={submitSurvey}
                    disabled={!allAnswered || submitting}
                    className={`w-full px-4 py-2 font-bold rounded-md transition-colors opacity-0 translate-y-4 submit ${
                        allAnswered
                            ? "bg-amber-400 text-gray-900 hover:bg-amber-300"
                            : "bg-gray-600 text-gray-400 cursor-not-allowed"
                    }`}
                >
                    {submitting ? "Submitting..." : "Submit"}
                </button>
            </div>

            <div className="flex-1 p-4 overflow-y-scroll flex flex-col items-center gap-4">
                {questions.map((q) => (
                    <div
                        key={q.id}
                        className="w-full max-w-6xl px-6 py-6 rounded-md border border-amber-400/30
                       bg-amber-400/10 opacity-0 translate-y-6 card"
                    >
                        <h2 className="text-xl font-semibold mb-4">{q.question}</h2>

                        <div className="flex flex-col gap-3">
                            {[q.option_a, q.option_b, q.option_c, q.option_d].map(
                                (opt, i) => (
                                    <label
                                        key={i}
                                        className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-md
                               bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
                                    >
                                        <input
                                            type="radio"
                                            name={`question-${q.id}`}
                                            checked={answers[q.id] === opt}
                                            onChange={() =>
                                                setAnswers((prev) => ({
                                                    ...prev,
                                                    [q.id]: opt,
                                                }))
                                            }
                                            className="w-4 h-4 accent-amber-400"
                                        />
                                        <span className="font-medium">{opt}</span>
                                    </label>
                                )
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
