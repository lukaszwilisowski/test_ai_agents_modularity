"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useRouter } from "next/navigation";

export function PianoCard() {
  const router = useRouter();

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-500 hover:scale-105"
      onClick={() => router.push("/piano")}
    >
      <CardHeader className="text-center">
        <div className="text-6xl mb-4 text-purple-500">🎹</div>
        <CardTitle className="text-xl font-bold">Pianos</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-center text-sm">
          Acoustic and digital pianos for all skill levels
        </p>
      </CardContent>
    </Card>
  );
}
