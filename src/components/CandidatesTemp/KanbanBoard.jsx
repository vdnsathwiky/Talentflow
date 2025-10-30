
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import { Link } from "react-router-dom";
import { db } from "../../db/dexieDB";

export default function KanbanBoard({ singleCandidateId }) {
  const queryClient = useQueryClient();
  const [draggingId, setDraggingId] = useState(null);

  const { data: candidates = [], isLoading } = useQuery({
    queryKey: ["candidates"],
    queryFn: async () => await db.candidates.toArray(),
  });

  // Define all stages including rejected
  const stages = [
    { id: "applied", title: "Applied", color: "bg-blue-500" },
    { id: "screen", title: "Screening", color: "bg-purple-500" },
    { id: "tech", title: "Technical", color: "bg-yellow-500" },
    { id: "offer", title: "Offer", color: "bg-green-500" },
    { id: "hired", title: "Hired", color: "bg-emerald-500" },
    { id: "rejected", title: "Rejected", color: "bg-red-500" }
  ];

  // Filter candidates if singleCandidateId is provided
  const filteredCandidates = singleCandidateId
    ? candidates.filter(c => c.id === parseInt(singleCandidateId))
    : candidates;

  // Group candidates by stage
  const groupedCandidates = stages.map((stage) => ({
    ...stage,
    items: filteredCandidates.filter((c) => c.stage === stage.id),
  }));

  const onDragStart = (result) => {
    setDraggingId(result.draggableId);
  };

  const onDragEnd = async (result) => {
    setDraggingId(null);
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const candidateId = parseInt(draggableId);
    const candidate = await db.candidates.get(candidateId);
    if (!candidate) return;

    const fromStage = candidate.stage;
    const toStage = destination.droppableId;

    try {
      // Update candidate stage
      await db.candidates.update(candidateId, {
        stage: toStage,
        updatedAt: new Date().toISOString()
      });

      // Add movement to timeline
      await db.timelines.add({
        candidateId,
        timestamp: new Date().toISOString(),
        note: `Moved from ${fromStage} to ${toStage}`,
        from: fromStage,
        to: toStage
      });

      // Refresh everything
      queryClient.invalidateQueries(["candidates"]);
      queryClient.invalidateQueries(["timeline"]);

    } catch (error) {
      console.error("Failed to update candidate stage:", error);
    }
  };

  const getStageStats = (stageId) => {
    const total = candidates.length;
    const stageCount = candidates.filter(c => c.stage === stageId).length;
    const percentage = total > 0 ? (stageCount / total * 100).toFixed(1) : 0;
    return { count: stageCount, percentage };
  };

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto p-4 bg-gray-50 rounded-lg">
        {stages.map(stage => (
          <div key={stage.id} className="bg-white shadow-md rounded-xl p-4 w-64 flex-shrink-0">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-3"></div>
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {!singleCandidateId && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {stages.map(stage => {
            const stats = getStageStats(stage.id);
            return (
              <div key={stage.id} className={`${stage.color} text-white rounded-lg p-4 text-center`}>
                <div className="text-2xl font-bold">{stats.count}</div>
                <div className="text-sm opacity-90">{stage.title}</div>
                <div className="text-xs opacity-75">{stats.percentage}%</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto p-4 bg-gray-50 rounded-lg min-h-[400px]">
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          {groupedCandidates.map((group) => (
            <Droppable key={group.id} droppableId={group.id}>
              {(provided, snapshot) => (
                <div
                  className={`bg-white shadow-md rounded-xl p-4 w-80 flex-shrink-0 transition-all ${snapshot.isDraggingOver ? 'ring-2 ring-blue-400' : ''
                    }`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {/* Stage Header */}
                  <div className={`${group.color} text-white rounded-lg p-3 mb-3`}>
                    <h2 className="font-semibold text-lg text-center">
                      {group.title}
                      <span className="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded-full text-sm">
                        {group.items.length}
                      </span>
                    </h2>
                  </div>

                  {/* Candidates List */}
                  <div className={`space-y-3 min-h-[200px] transition-colors ${snapshot.isDraggingOver ? 'bg-blue-50 rounded-lg p-2' : ''
                    }`}>
                    {group.items.map((candidate, index) => (
                      <Draggable
                        key={candidate.id.toString()}
                        draggableId={candidate.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            className={`bg-white border-2 rounded-lg p-3 shadow-sm cursor-pointer transition-all ${snapshot.isDragging
                              ? 'transform rotate-2 shadow-lg border-blue-400'
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                              } ${draggingId === candidate.id.toString() ? 'opacity-50' : ''
                              }`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                {candidate.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                                  {candidate.name}
                                </h3>
                                <p className="text-gray-500 text-xs truncate mt-1">
                                  {candidate.email}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs text-gray-400">
                                    Job #{candidate.jobId}
                                  </span>
                                  <Link
                                    to={`/candidates/${candidate.id}`}
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    View
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {/* Empty State */}
                    {group.items.length === 0 && !snapshot.isDraggingOver && (
                      <div className="text-center py-8 text-gray-400">
                        <div className="text-4xl mb-2">📭</div>
                        <p className="text-sm">No candidates</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm text-center">
          💡 <strong>Drag and drop</strong> candidates between stages to update their hiring status.
          All changes are automatically saved and tracked in the timeline.
        </p>
      </div>
    </div>
  );
}