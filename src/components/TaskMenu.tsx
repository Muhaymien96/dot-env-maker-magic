
import React from 'react';
import { Edit3, Clock, Trash2 } from 'lucide-react';

interface TaskMenuProps {
  task: any;
  onEditTask: (task: any) => void;
  onUpdateTaskStatus: (id: string, status: any) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskMenu: React.FC<TaskMenuProps> = ({
  task,
  onEditTask,
  onUpdateTaskStatus,
  onDeleteTask
}) => {
  return (
    <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
      <div className="py-1">
        <button
          onClick={() => onEditTask(task)}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
        >
          <Edit3 className="h-4 w-4" />
          <span>Edit Task</span>
        </button>
        <button
          onClick={() => onUpdateTaskStatus(task.id, task.status === 'in_progress' ? 'pending' : 'in_progress')}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
        >
          <Clock className="h-4 w-4" />
          <span>{task.status === 'in_progress' ? 'Mark as Pending' : 'Start Working'}</span>
        </button>
        <button
          onClick={() => onDeleteTask(task.id)}
          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete Task</span>
        </button>
      </div>
    </div>
  );
};
