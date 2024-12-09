// src/components/DashboardHero.tsx
import Image from "next/image";

const DashboardHero = () => {
  return (
    <div className="w-full min-h-screen bg-red-500 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Left side - Text content */}
          <div className="flex-1 space-y-6">
            <h1 className="text-5xl font-bold text-white leading-tight">
              Experience Culinary Excellence
            </h1>
            <p className="text-lg text-white/90">
              Book your table now and indulge in an unforgettable dining experience.
            </p>
            <button className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors">
              Reserve a Table
            </button>
          </div>

          {/* Right side - Image */}
          <div className="flex-1 relative h-[400px] w-full">
            <Image
              src="/firstPic.jpeg"
              alt="Restaurant Image"
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;