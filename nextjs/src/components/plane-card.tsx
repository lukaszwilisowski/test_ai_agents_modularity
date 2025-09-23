'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export function PlaneCard() {
  const router = useRouter();

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-500 hover:scale-105"
      onClick={() => router.push('/plane')}
    >
      <CardHeader className="text-center">
        <div className="text-6xl mb-4 text-blue-500">
          ✈️
        </div>
        <CardTitle className="text-xl font-bold">
          Planes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-center text-sm">
          Manage your aircraft fleet and aviation inventory
        </p>
      </CardContent>
    </Card>
  );
}
