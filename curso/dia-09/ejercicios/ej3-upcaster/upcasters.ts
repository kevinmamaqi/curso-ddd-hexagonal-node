export interface TaskAssignedV1 {
  taskId: string;
  assignedTo: string;
  version: 1;
  details?: string;
}

export interface TaskAssignedV2 {
  taskId: string;
  assignedTo: string;
  priority: "high" | "medium" | "low";
  version: 2;
  details?: string;
}

export function upcastTaskAssigned(eventData: any): TaskAssignedV2 {
  if (eventData.version === 1) {
    return {
      taskId: eventData.taskId,
      assignedTo: eventData.assignedTo,
      priority: "low",
      details: eventData.details,
      version: 2,
    };
  }
  return eventData as TaskAssignedV2;
}
