import { useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { Link } from "react-router-dom";
import { useCandidates } from "../hooks/useCandidates";
import { Search, Filter, User, Mail, Briefcase, Calendar } from "lucide-react";

export default function CandidatesPage() {
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 50;

  const { data, isLoading, isError } = useCandidates({
    search,
    stage,
    page,
    pageSize,
  });

  const items = data?.data || [];
  const meta = data?.meta || {};

  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading candidates...</p>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to load candidates</h2>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );

  const getStageColor = (stage) => {
    const colors = {
      applied: "bg-blue-100 text-blue-800",
      screen: "bg-purple-100 text-purple-800",
      tech: "bg-yellow-100 text-yellow-800",
      offer: "bg-green-100 text-green-800",
      hired: "bg-emerald-100 text-emerald-800",
      rejected: "bg-red-100 text-red-800"
    };
    return colors[stage] || "bg-gray-100 text-gray-800";
  };

  const CandidateRow = ({ candidate }) => (
    <div className="border-b border-gray-200 last:border-b-0">
      <div className="p-6 hover:bg-gray-50 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {candidate.name}
                </h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStageColor(candidate.stage)}`}>
                  {candidate.stage}
                </span>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{candidate.email}</span>
                </div>

                <div className="flex items-center space-x-1">
                  <Briefcase className="w-4 h-4" />
                  <span>Job #{candidate.jobId}</span>
                </div>

                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(candidate.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to={`/candidates/${candidate.id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              View Profile
            </Link>

            <Link
              to="/candidates/kanban"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              Kanban
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">Candidates</h1>
              <p className="text-gray-600 mt-2">
                Manage {meta.total || 0} candidates across all hiring stages
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full lg:w-80 transition-all"
                />
              </div>

              {/* Stage Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={stage}
                  onChange={(e) => {
                    setStage(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white w-full lg:w-48 transition-all"
                >
                  <option value="">All Stages</option>
                  <option value="applied">Applied</option>
                  <option value="screen">Screening</option>
                  <option value="tech">Technical</option>
                  <option value="offer">Offer</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Candidate List */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {items.length > 0 ? (
            <div className="h-[600px]">
              <Virtuoso
                data={items}
                itemContent={(index, candidate) => (
                  <CandidateRow key={candidate.id} candidate={candidate} />
                )}
              />
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No candidates found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {search || stage
                  ? "Try adjusting your search criteria or filters"
                  : "No candidates available in the system"
                }
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{(page - 1) * pageSize + 1}</span> to{" "}
              <span className="font-semibold">
                {Math.min(page * pageSize, meta.total)}
              </span>{" "}
              of <span className="font-semibold">{meta.total}</span> candidates
            </div>

            <div className="flex items-center space-x-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${page === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
              >
                Previous
              </button>

              <span className="px-3 py-2 text-sm text-gray-600">
                Page <strong>{page}</strong> of <strong>{meta.totalPages}</strong>
              </span>

              <button
                disabled={page >= meta.totalPages}
                onClick={() => setPage(p => p + 1)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${page >= meta.totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}