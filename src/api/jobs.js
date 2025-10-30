
export async function fetchJobs({ page = 1, search = "", status = "" }) {
  const params = new URLSearchParams({ page, search, status });
  const res = await fetch(`/jobs?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
}
