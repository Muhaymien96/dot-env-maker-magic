
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface TasksHeaderProps {
  completedTasksCount: number;
  onAddTask: () => void;
  onClearCompleted: () => void;
}

export const TasksHeader: React.FC<TasksHeaderProps> = ({
  completedTasksCount,
  onAddTask,
  onClearCompleted
}) => {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-2xl font-bold text-gray-900">Your Tasks</h3>
      <div className="flex space-x-3">
        {completedTasksCount > 0 && (
          <button
            onClick={onClearCompleted}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            aria-label={`Clear ${completedTasksCount} completed tasks`}
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear Completed ({completedTasksCount})</span>
          </button>
        )}
        <button
          onClick={onAddTask}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Task</span>
        </button>
      </div>
    </div>
  );
};
