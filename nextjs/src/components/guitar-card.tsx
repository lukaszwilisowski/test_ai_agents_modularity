'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export function GuitarCard() {
  const router = useRouter();

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-amber-500 hover:scale-105"
      onClick={() => router.push('/guitar')}
    >
      <CardHeader className="text-center">
        <div className="text-6xl mb-4 text-amber-500">
          🎸
        </div>
        <CardTitle className="text-xl font-bold">
          Guitars
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-center text-sm">
          Electric and acoustic guitars for all skill levels
        </p>
      </CardContent>
    </Card>
  );
}