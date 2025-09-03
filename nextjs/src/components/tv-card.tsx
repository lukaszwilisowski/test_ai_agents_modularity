"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useRouter } from "next/navigation";

export function TvCard() {
  const router = useRouter();

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-500 hover:scale-105"
      onClick={() => router.push("/tv")}
    >
      <CardHeader className="text-center">
        <div className="text-6xl mb-4 text-blue-500">📺</div>
        <CardTitle className="text-xl font-bold">TVs</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-center text-sm">
          Smart TVs, OLED, QLED, and LED displays for your entertainment
        </p>
      </CardContent>
    </Card>
  );
}
