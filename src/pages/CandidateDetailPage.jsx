import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "../db/dexieDB";
import { Mail, Phone, Calendar, MapPin, Briefcase, Clock, User } from "lucide-react";

export default function CandidateDetailPage() {
  const { id } = useParams();
  const candidateId = Number(id);
  const queryClient = useQueryClient();

  // Fetch candidate
  const { data: candidate, isLoading: candidateLoading } = useQuery({
    queryKey: ["candidate", candidateId],
    queryFn: async () => {
      const data = await db.candidates.get(candidateId);
      if (!data) throw new Error("Candidate not found");
      return data;
    },
    enabled: !!candidateId,
  });

  // Fetch timeline
  const { data: timeline = [] } = useQuery({
    queryKey: ["timeline", candidateId],
    queryFn: async () => {
      const entries = await db.timelines
        .where("candidateId")
        .equals(candidateId)
        .sortBy("timestamp");
      return entries.reverse(); // Show latest first
    },
    enabled: !!candidateId,
  });

  // Fetch job details
  const { data: job } = useQuery({
    queryKey: ["job", candidate?.jobId],
    queryFn: async () => {
      if (!candidate?.jobId) return null;
      return await db.jobs.get(candidate.jobId);
    },
    enabled: !!candidate?.jobId,
  });

  // Stage update mutation
  const updateStageMutation = useMutation({
    mutationFn: async (newStage) => {
      const oldStage = candidate.stage;

      // Update candidate
      await db.candidates.update(candidateId, {
        stage: newStage,
        updatedAt: new Date().toISOString()
      });

      // Add to timeline
      await db.timelines.add({
        candidateId,
        timestamp: new Date().toISOString(),
        note: `Stage changed from ${oldStage} to ${newStage}`,
        from: oldStage,
        to: newStage
      });

      return newStage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["candidate", candidateId]);
      queryClient.invalidateQueries(["timeline", candidateId]);
    }
  });

  // Add note mutation
  const addNoteMutation = useMutation({
    mutationFn: async (noteText) => {
      await db.timelines.add({
        candidateId,
        timestamp: new Date().toISOString(),
        note: noteText,
        from: candidate.stage,
        to: candidate.stage // Same stage for notes
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["timeline", candidateId]);
    }
  });

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

  const handleAddNote = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const noteText = formData.get('note');

    if (noteText && noteText.trim()) {
      addNoteMutation.mutate(noteText.trim());
      e.target.reset();
    }
  };

  // Debug: Check data consistency
  console.log('🔍 Candidate Data:', {
    candidate,
    job,
    timeline,
    currentStage: candidate?.stage,
    timelineStages: timeline.map(t => ({ from: t.from, to: t.to }))
  });

  if (candidateLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading candidate profile...</p>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Candidate Not Found</h2>
          <p className="text-gray-600 mb-6">The candidate you're looking for doesn't exist.</p>
          <Link
            to="/candidates"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Candidates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                to="/candidates"
                className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-flex items-center"
              >
                ← Back to Candidates
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">{candidate.name}</h1>
              <p className="text-gray-600 mt-2">{candidate.email}</p>
            </div>

            <div className="flex items-center space-x-4">
              <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${getStageColor(candidate.stage)}`}>
                {candidate.stage}
              </span>
              <Link
                to="/candidates/kanban"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Open Kanban
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Candidate Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Candidate Information</h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                    <p className="text-gray-600 text-sm">Candidate #{candidate.id}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Mail className="w-5 h-5" />
                    <span className="text-sm">{candidate.email}</span>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-600">
                    <Briefcase className="w-5 h-5" />
                    <span className="text-sm">
                      {job ? `Job #${job.id} - ${job.title}` : `Job #${candidate.jobId || 'Not assigned'}`}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-600">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm">
                      Applied {new Date(candidate.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-600">
                    <Clock className="w-5 h-5" />
                    <span className="text-sm">
                      Last updated: {new Date(candidate.updatedAt || candidate.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage Control Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Update Stage</h2>
              <p className="text-sm text-gray-600 mb-4">Current stage: <span className="font-semibold capitalize">{candidate.stage}</span></p>

              <div className="space-y-2">
                {['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'].map((stage) => (
                  <button
                    key={stage}
                    onClick={() => updateStageMutation.mutate(stage)}
                    disabled={candidate.stage === stage || updateStageMutation.isLoading}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${candidate.stage === stage
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                      } ${updateStageMutation.isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="capitalize">{stage}</span>
                      {candidate.stage === stage && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {updateStageMutation.isLoading && (
                <p className="text-sm text-blue-600 mt-3">Updating stage...</p>
              )}
            </div>
          </div>

          {/* Right Column - Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Hiring Timeline</h2>
                <div className="text-sm text-gray-500">
                  {timeline.length} {timeline.length === 1 ? 'entry' : 'entries'}
                </div>
              </div>

              {timeline.length > 0 ? (
                <div className="space-y-6">
                  {timeline.map((entry, index) => (
                    <div key={entry.id || index} className="flex space-x-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full mt-1 ${entry.to === 'hired' ? 'bg-green-500' :
                          entry.to === 'rejected' ? 'bg-red-500' : 'bg-blue-500'
                          }`}></div>
                        {index < timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                        )}
                      </div>

                      <div className="flex-1 pb-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStageColor(entry.to)
                            }`}>
                            {entry.to}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(entry.timestamp).toLocaleDateString()} at{' '}
                            {new Date(entry.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">{entry.note}</p>
                        {entry.from && entry.from !== entry.to && (
                          <p className="text-xs text-gray-500 mt-1">
                            Changed from: <span className="capitalize font-medium">{entry.from}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No timeline entries yet.</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Update the candidate's stage to create timeline entries.
                  </p>
                </div>
              )}
            </div>

            {/* Activity Notes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes & Activity</h2>
              <form onSubmit={handleAddNote} className="space-y-4">
                <textarea
                  name="note"
                  placeholder="Add notes about this candidate..."
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  required
                />
                <button
                  type="submit"
                  disabled={addNoteMutation.isLoading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
                >
                  {addNoteMutation.isLoading ? 'Adding Note...' : 'Add Note'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}