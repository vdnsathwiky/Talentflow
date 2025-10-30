
import { Link } from "react-router-dom";
import { Mail, Calendar, Briefcase } from "lucide-react";

export default function CandidateRow({ candidate }) {
  const getStageColor = (stage) => {
    const colors = {
      applied: "bg-blue-100 text-blue-800 border-blue-200",
      screen: "bg-purple-100 text-purple-800 border-purple-200",
      tech: "bg-yellow-100 text-yellow-800 border-yellow-200",
      offer: "bg-green-100 text-green-800 border-green-200",
      hired: "bg-emerald-100 text-emerald-800 border-emerald-200",
      rejected: "bg-red-100 text-red-800 border-red-200"
    };
    return colors[stage] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-4 flex-1">
        {/* Avatar */}
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
          {candidate.name.split(' ').map(n => n[0]).join('')}
        </div>

        {/* Candidate Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="font-semibold text-gray-900 text-lg truncate">
              {candidate.name}
            </h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize border ${getStageColor(candidate.stage)}`}>
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

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
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
  );
}