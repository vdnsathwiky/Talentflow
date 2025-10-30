import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { db } from "../db/dexieDB";

async function fetchJobById(id) {
  return await db.jobs.get(id);
}

export default function JobDetailPage() {
  const { jobId } = useParams();
  const { data, isLoading } = useQuery(["job", jobId], () => fetchJobById(jobId));

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!data) return <div className="p-8 text-red-600">Job not found.</div>;

  return (
    <div className="p-8">
      <Link to="/jobs" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Jobs
      </Link>
      <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
      <p className="text-gray-600 mb-2">Status: {data.status}</p>
      <div className="text-gray-800 whitespace-pre-wrap">{data.description}</div>
      {data.tags?.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-1">Tags:</h4>
          <div className="flex flex-wrap gap-2">
            {data.tags.map((t) => (
              <span
                key={t}
                className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
