export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-16">
      <div className="max-w-7xl mx-auto text-center px-6">
        <h2 className="text-4xl font-extrabold mb-4">
          Find Your Perfect Job Match
        </h2>
        <p className="text-lg text-blue-100 mb-8">
          Find Jobs, Employment & Career Opportunities
        </p>

        <div className="bg-white rounded-xl shadow-lg flex items-center justify-between max-w-3xl mx-auto overflow-hidden">
          <input
            type="text"
            placeholder="Job title, keywords..."
            className="flex-1 px-4 py-3 text-gray-700 outline-none"
          />
          <input
            type="text"
            placeholder="Location"
            className="flex-1 px-4 py-3 text-gray-700 outline-none border-l border-gray-200"
          />
          <button className="bg-yellow-400 text-blue-900 font-semibold px-6 py-3 hover:bg-yellow-300 transition">
            Find Jobs
          </button>
        </div>

        <p className="text-blue-100 mt-6 text-sm">
          Popular Searches: Designer, Developer, Web, iOS, PHP, Engineer
        </p>
      </div>
    </section>
  );
}
