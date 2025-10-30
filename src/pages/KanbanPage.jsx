import React from "react";
import KanbanBoard from "../components/CandidatesTemp/KanbanBoard";

export default function KanbanPage() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Candidates — Kanban</h1>
      <KanbanBoard />
    </div>
  );
}
