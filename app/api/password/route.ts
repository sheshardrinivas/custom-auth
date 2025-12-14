import { NextResponse } from "next/server";
import argon2 from "argon2";
import { supabase } from "@/app/lib/supabase";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const hashedPassword = await argon2.hash(password, { type: argon2.argon2id });

  const data = await supabase
    .from("auth")
    .update({ password: hashedPassword })
    .eq("user_name", username);

  return NextResponse.json(
    { message: "changed password successfully" },
    { status: 200 },
  );
}
