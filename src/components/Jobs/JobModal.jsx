
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../../db/dexieDB";

export default function JobModal({ job, onClose, refreshJobs }) {
  const isNew = !job;

  const [formData, setFormData] = useState({
    title: "",
    status: "active",
    tags: "",
    description: "",
  });

  // Load job if editing
  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || "",
        status: job.status || "active",
        tags: job.tags?.join(", ") || "",
        description: job.description || "",
      });
    }
  }, [job]);

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Add or Update Job in DexieDB
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newJob = {
      title: formData.title.trim(),
      status: formData.status,
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      description: formData.description.trim(),
    };

    try {
      if (isNew) {
        // Add new job
        newJob.slug =
          formData.title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
        await db.jobs.add(newJob);
        alert("✅ Job added successfully!");
      } else {
        // Update existing job
        await db.jobs.update(job.id, newJob);
        alert("✏️ Job updated successfully!");
      }
      refreshJobs(); // reload job list in parent
      onClose();
    } catch (err) {
      console.error("❌ Error saving job:", err);
      alert("Failed to save job.");
    }
  };

  // 🗑️ Delete job
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await db.jobs.delete(job.id);
      alert("🗑️ Job deleted successfully!");
      refreshJobs();
      onClose();
    } catch (err) {
      console.error("❌ Error deleting job:", err);
      alert("Failed to delete job.");
    }
  };

  // 📦 Archive or Unarchive
  const handleToggleArchive = async () => {
    try {
      const newStatus = job.status === "archived" ? "active" : "archived";
      await db.jobs.update(job.id, { status: newStatus });
      alert(`📦 Job ${newStatus === "archived" ? "archived" : "restored"}!`);
      refreshJobs();
      onClose();
    } catch (err) {
      console.error("❌ Error updating job:", err);
      alert("Failed to change job status.");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-lg"
          initial={{ scale: 0.9, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {isNew ? "➕ Add New Job" : "✏️ Edit Job"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition text-xl"
            >
              ✖
            </button>
          </div>

          {/* Job Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-600 mb-1">Job Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g., Frontend Developer"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Tags</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="comma separated (e.g., remote, tech)"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Description</label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Write short job description..."
              ></textarea>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-between pt-4">
              {!isNew && (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleToggleArchive}
                    className={`px-4 py-2 rounded-lg transition ${job.status === "archived"
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-yellow-500 hover:bg-yellow-600 text-white"
                      }`}
                  >
                    {job.status === "archived" ? "Unarchive" : "Archive"}
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {isNew ? "Save Job" : "Update Job"}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
