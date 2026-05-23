export default function Home() {
  return (
<main className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[320px] md:h-[500px] bg-purple-600 opacity-20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[320px] md:h-[500px] bg-cyan-500 opacity-20 blur-[120px]" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/10 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold tracking-wide">
          AURA AI
        </h1>

        <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          <a href="#">Features</a>
          <a href="#">AI Stylist</a>
          <a href="#">Wardrobe</a>
          <a href="#">Trends</a>
        </div>

        <button className="bg-white text-black px-5 py-2 rounded-full font-medium hover:scale-105 transition">
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-28 pb-24 max-w-7xl mx-auto">

        <div className="mb-6 px-4 py-2 border border-white/10 rounded-full bg-white/5 backdrop-blur-md text-sm text-gray-300">
          AI Fashion Intelligence
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight max-w-5xl">
          Your Personal
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {" "}AI Fashion Stylist
          </span>
        </h1>

        <p className="mt-8 max-w-2xl text-gray-400 text-lg leading-relaxed">
          Organize your wardrobe, discover perfect outfits,
          get AI styling recommendations, and transform your
          fashion identity every single day.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-5">

          <button className="bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transition duration-300">
            Start Your Style Journey
          </button>

          <button className="border border-white/20 px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition">
            Explore Features
          </button>

        </div>

      </section>

      {/* Feature Cards */}
      <section className="relative z-10 px-8 pb-24">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:-translate-y-2 transition duration-300">
            <h2 className="text-2xl font-bold mb-4">
              Smart Wardrobe
            </h2>

            <p className="text-gray-400 leading-relaxed">
              Upload clothes and let AI organize your wardrobe automatically with intelligent categorization.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:-translate-y-2 transition duration-300">
            <h2 className="text-2xl font-bold mb-4">
              AI Outfit Matching
            </h2>

            <p className="text-gray-400 leading-relaxed">
              Get personalized outfit recommendations based on weather, style, mood, and occasion.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:-translate-y-2 transition duration-300">
            <h2 className="text-2xl font-bold mb-4">
              Style Intelligence
            </h2>

            <p className="text-gray-400 leading-relaxed">
              Discover your unique fashion identity with AI-powered style analysis and grooming suggestions.
            </p>
          </div>

        </div>

      </section>

    </main>
  );
}