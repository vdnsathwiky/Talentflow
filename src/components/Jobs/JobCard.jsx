export default function JobCard({ job }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <h3 className="text-xl font-semibold text-blue-800 mb-2">{job.title}</h3>
      <p className="text-sm text-gray-500 mb-3">
        Status:{" "}
        <span
          className={`font-medium ${job.status === "active" ? "text-green-600" : "text-gray-500"
            }`}
        >
          {job.status}
        </span>
      </p>
      <div className="flex justify-between items-center">
        <button className="text-indigo-600 font-medium hover:underline">
          View Details
        </button>
        <button className="text-sm px-3 py-1 border rounded-md text-gray-600 hover:bg-gray-100 transition">
          Archive
        </button>
      </div>
    </div>
  );
}
