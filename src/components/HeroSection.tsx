export function HeroSection() {
  return (
    <section className="h-[70vh] relative overflow-hidden flex justify-center items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://backiee.com/static/wallpapers/3840x2160/325616.jpg')`,
        }}
      ></div>
      <div className=" h-full  absolute top-0 left-0 w-screen z-10 bg-black/60"></div>

      {/* //content */}
      <div className="max-w-4xl px-4 text-center relative z-20">
        <h1 className="font-sans font-bold text-3xl md:text-6xl lg:text-7xl text-white mb-6 drop-shadow-lg">
          Find Your Perfect Stay
        </h1>
        <p className="text-base md:text-xl text-gray-200 max-w-2xl mx-auto mb-8 leading-relaxed drop-shadow-md">
          Browse curated flats with verified listings, transparent pricing, and
          instant booking with us.
        </p>
        <div className="hidden md:flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            Start Searching
          </button>
          <button className="border-2 border-white/80 hover:border-white bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-lg font-medium text-lg transition-all duration-300">
            Learn More
          </button>
        </div>
        <div className="md:hidden">
          <button className="px-6 py-4 bg-blue-600 text-white rounded-md">
            Start Searching
          </button>
        </div>
        <div className="md:hidden mt-2">
          <button className="px-6 py-4 bg-white/10 border-white/80 text-white rounded-md">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
