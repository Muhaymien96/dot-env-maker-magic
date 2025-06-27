
import React, { useState } from 'react';
import { 
  Clock, 
  Calendar,
  Tag,
  MoreHorizontal,
  Play,
  CheckCircle,
  Edit3,
  Trash2
} from 'lucide-react';
import { ExtendedTask } from './TaskManager';
import { Task } from '../lib/supabase';

interface SimpleTaskCardProps {
  task: ExtendedTask;
  onEdit: (task: ExtendedTask) => void;
  onDelete: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: Task['status']) => void;
}

export const SimpleTaskCard: React.FC<SimpleTaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusButton = () => {
    switch (task.status) {
      case 'completed':
        return (
          <button
            onClick={() => onStatusChange?.(task.id, 'pending')}
            className="p-2 text-green-600 hover:bg-green-50 rounded-full"
            title="Mark as pending"
          >
            <CheckCircle className="h-5 w-5" />
          </button>
        );
      case 'in_progress':
        return (
          <button
            onClick={() => onStatusChange?.(task.id, 'completed')}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
            title="Mark as completed"
          >
            <Clock className="h-5 w-5" />
          </button>
        );
      default:
        return (
          <button
            onClick={() => onStatusChange?.(task.id, 'in_progress')}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-full"
            title="Start working"
          >
            <Play className="h-5 w-5" />
          </button>
        );
    }
  };

  return (
    <div className={`bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 ${
      task.status === 'completed' ? 'opacity-75' : ''
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-grow">
          {getStatusButton()}
          
          <div className="flex-grow">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className={`font-medium ${
                task.status === 'completed' 
                  ? 'line-through text-gray-500' 
                  : 'text-gray-900'
              }`}>
                {task.title}
              </h4>
            </div>
            
            {task.description && (
              <p className="text-gray-600 text-sm mb-2">{task.description}</p>
            )}
            
            <div className="flex items-center flex-wrap gap-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              
              {task.due_date && (
                <span className="flex items-center space-x-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                </span>
              )}
              
              {task.tags && task.tags.length > 0 && (
                <div className="flex items-center space-x-1">
                  <Tag className="h-3 w-3 text-gray-400" />
                  {task.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <span className="text-xs text-gray-500">
                Created: {new Date(task.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 text-gray-600 hover:bg-gray-50 rounded"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
              <div className="py-1">
                <button
                  onClick={() => {
                    onEdit(task);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit Task</span>
                </button>
                <button
                  onClick={() => {
                    onDelete(task.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Task</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
