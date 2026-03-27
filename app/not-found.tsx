import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-6 bg-gray-50/10">
      <div className="space-y-6 max-w-md">
        <h1 className="text-8xl font-black text-primary/20 italic">404</h1>
        <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Route Not Found</h2>
        <p className="text-gray-500 font-medium italic">
          The luxury journey you are looking for has either moved or doesn't exist.
        </p>
        <div className="pt-8">
            <Link href="/">
              <Button className="px-10 py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20">
                Return to Home
              </Button>
            </Link>
        </div>
      </div>
    </div>
  );
}
