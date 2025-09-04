import Link from "next/link";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Multi-Category Store</h1>
        <p className="text-gray-600">
          Discover amazing products across multiple categories
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Guitar Module Card */}
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border">
          <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
            <div className="text-4xl">🎸</div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Guitars</h2>
          <p className="text-gray-600 mb-4">
            Acoustic and electric guitars for all skill levels
          </p>
          <Link
            href="/guitars"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Shop Guitars
          </Link>
        </div>

        {/* Car Module Card */}
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border">
          <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
            <div className="text-4xl">🚗</div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Cars</h2>
          <p className="text-gray-600 mb-4">
            Premium vehicles for every lifestyle and budget
          </p>
          <Link
            href="/cars"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Shop Cars
          </Link>
        </div>

        {/* TV Module Card */}
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border">
          <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
            <div className="text-4xl">📺</div>
          </div>
          <h2 className="text-xl font-semibold mb-2">TVs</h2>
          <p className="text-gray-600 mb-4">
            Premium televisions with latest technology
          </p>
          <Link
            href="/tvs"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Shop TVs
          </Link>
        </div>

        {/* Computer Module Card */}
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border">
          <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
            <div className="text-4xl">💻</div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Computers</h2>
          <p className="text-gray-600 mb-4">
            High-performance desktops and laptops for work and gaming
          </p>
          <Link
            href="/computers"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Shop Computers
          </Link>
        </div>
      </div>
    </main>
  );
}
