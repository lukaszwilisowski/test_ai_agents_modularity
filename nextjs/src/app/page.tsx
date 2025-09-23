import { GuitarCard } from "@/components/guitar-card";
import { PianoCard } from "@/components/piano-card";
import { TvCard } from "@/components/tv-card";
import { CarCard } from "@/components/car-card";
import { DrumsCard } from "@/components/drums-card";
import { LaptopCard } from "@/components/laptop-card";
import { PlaneCard } from "@/components/plane-card";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">AI Agent Testing Framework</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Simple horizontal architecture for testing different AI agents and
          models. Each module is a set of files following naming conventions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <GuitarCard />
        <TvCard />
        <PianoCard />
        <CarCard />
        <DrumsCard />
        <LaptopCard />
        <PlaneCard />
        {/* Add more module cards here manually */}
      </div>
    </main>
  );
}
