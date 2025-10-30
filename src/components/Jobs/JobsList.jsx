import JobCard from "./JobCard";

export default function JobsList({ jobs }) {
  if (!jobs?.length) {
    return (
      <div className="text-center py-20 text-gray-500 italic">
        No jobs found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
