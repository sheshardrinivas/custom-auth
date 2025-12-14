import Link from "next/link";
export default function Home() {
  return (
    <div className="flex flex-col gap-6 h-screen w-screen items-center justify-center p-2 font-sans bg-background  ">
      Login to your account
      <Link href="/login" className="border-2 border-white p-2 rounded-xl">
        Login
      </Link>
    </div>
  );
}
