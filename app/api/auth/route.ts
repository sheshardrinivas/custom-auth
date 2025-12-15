import { NextResponse } from "next/server";
import argon2 from "argon2";
import { supabase } from "@/app/lib/supabase";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const { data, error } = await supabase
      .from("auth")
      .select("password")
      .eq("user", username)
      .single();

    if (error || !data) {
      return NextResponse.json({ auth: false }, { status: 401 });
    }

    const isValid = await argon2.verify(data.password, password);
    const cookieStore = await cookies();
    cookieStore.set("session", "logged-in", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    return NextResponse.json({ auth: isValid });
  } catch {
    return NextResponse.json({ auth: false }, { status: 500 });
  }
}
