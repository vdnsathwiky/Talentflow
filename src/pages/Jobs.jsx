
import { useEffect, useState } from "react";
import { db } from "../db/dexieDB";
import { seedDatabase } from "../db/seedData";
import JobModal from "../components/Jobs/JobModal";
import { motion } from "framer-motion";
import {
  Pencil,
  Trash2,
  Archive,
  ArchiveRestore,
  Briefcase,
  Filter,
} from "lucide-react";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [filter, setFilter] = useState("all"); // ✅ "all" | "active" | "archived"

  // ✅ Load jobs from DexieDB
  const loadJobs = async () => {
    const data = await db.jobs.toArray();
    setJobs(data);
  };

  useEffect(() => {
    const init = async () => {
      await seedDatabase();
      await loadJobs();
      setIsInitialized(true);
    };
    init();
  }, []);

  // ✅ Filter jobs by status and search
  const filteredJobs = jobs
    .filter((j) => {
      if (filter === "active") return j.status === "active";
      if (filter === "archived") return j.status === "archived";
      return true;
    })
    .filter((j) => j.title.toLowerCase().includes(search.toLowerCase()));

  // ✅ Modal Actions
  const handleNewJob = () => {
    if (!isInitialized) return;
    setSelectedJob(null);
    setOpenModal(true);
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setOpenModal(true);
  };

  const handleToggleArchive = async (job) => {
    const newStatus = job.status === "archived" ? "active" : "archived";
    await db.jobs.update(job.id, { status: newStatus });
    await loadJobs();
  };

  const handleDeleteJob = async (job) => {
    if (window.confirm(`Are you sure you want to delete "${job.title}"?`)) {
      await db.jobs.delete(job.id);
      await loadJobs();
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-yellow-50 min-h-screen">
      {/* ===== HEADER SECTION ===== */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <Briefcase className="text-blue-800 w-8 h-8" />
          <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">
            Job Board
          </h1>
        </div>

        <button
          onClick={handleNewJob}
          className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-gray-900 font-semibold px-5 py-2 rounded-lg shadow-md transition transform hover:scale-105"
        >
          + New Job
        </button>
      </div>

      {/* ===== FILTER BAR ===== */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <Filter className="text-gray-600 w-5 h-5" />
          <div className="flex gap-2">
            {["all", "active", "archived"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-1 rounded-full text-sm font-medium transition ${filter === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <input
          type="text"
          placeholder="🔍 Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-blue-300 rounded-lg px-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* ===== JOB CARDS ===== */}
      {!isInitialized ? (
        <p className="text-gray-500 italic">Loading jobs...</p>
      ) : filteredJobs.length === 0 ? (
        <p className="text-gray-500 italic">No jobs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <motion.div
              key={job.id || job.slug}
              className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all flex flex-col justify-between"
              whileHover={{ scale: 1.02 }}
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {job.title}
                </h3>
                <p className="text-sm mt-1">
                  Status:{" "}
                  <span
                    className={`font-semibold ${job.status === "active"
                      ? "text-green-600"
                      : "text-red-500"
                      }`}
                  >
                    {job.status}
                  </span>
                </p>

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {job.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                  {job.description || "No description provided."}
                </p>
              </div>

              {/* ===== ACTION BUTTONS ===== */}
              <div className="mt-5 flex justify-between items-center">
                <button
                  onClick={() => handleEditJob(job)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <Pencil size={16} /> Edit
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleToggleArchive(job)}
                    className="flex items-center gap-1 text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                  >
                    {job.status === "archived" ? (
                      <>
                        <ArchiveRestore size={16} /> Unarchive
                      </>
                    ) : (
                      <>
                        <Archive size={16} /> Archive
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDeleteJob(job)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ===== MODAL (Add/Edit) ===== */}
      {openModal && (
        <JobModal
          job={selectedJob}
          onClose={() => {
            setOpenModal(false);
            setSelectedJob(null);
            loadJobs();
          }}
        />
      )}
    </div>
  );
}
