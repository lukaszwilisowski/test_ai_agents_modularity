"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export function DrumsCard() {
  const router = useRouter();

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-red-500 hover:scale-105"
      onClick={() => router.push("/drums")}
    >
      <CardHeader className="text-center">
        <div className="text-6xl mb-4 text-red-500">🥁</div>
        <CardTitle className="text-xl font-bold">Drums</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-center text-sm">
          Acoustic and electronic drum kits for all styles
        </p>
      </CardContent>
    </Card>
  );
}
