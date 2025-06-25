
import React from 'react';
import { 
  Clock, 
  ChevronRight, 
  ChevronDown,
  GripVertical,
  Repeat,
  Calendar,
  Tag,
  MoreHorizontal,
  Play,
  RotateCcw,
  Star,
  Gauge
} from 'lucide-react';
import { Task } from '../lib/supabase';

interface TaskCardProps {
  task: any;
  level?: number;
  draggedTask: string | null;
  showTaskMenu: string | null;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetTaskId: string) => void;
  onToggleExpansion: (taskId: string) => void;
  onUpdateTaskStatus: (id: string, status: Task['status']) => void;
  onSetShowTaskMenu: (taskId: string | null) => void;
  renderTaskMenu: (task: any) => React.ReactNode;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  level = 0,
  draggedTask,
  showTaskMenu,
  onDragStart,
  onDragOver,
  onDrop,
  onToggleExpansion,
  onUpdateTaskStatus,
  onSetShowTaskMenu,
  renderTaskMenu
}) => {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getComplexityStars = (complexity: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < complexity ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getStatusButton = (task: any) => {
    switch (task.status) {
      case 'completed':
        return (
          <button
            onClick={() => onUpdateTaskStatus(task.id, 'pending')}
            className="p-1 text-green-600 hover:bg-green-50 rounded"
            aria-label={`Mark task "${task.title}" as pending`}
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        );
      case 'in_progress':
        return (
          <button
            onClick={() => onUpdateTaskStatus(task.id, 'completed')}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            aria-label={`Mark task "${task.title}" as completed`}
          >
            <Clock className="h-4 w-4" />
          </button>
        );
      default:
        return (
          <button
            onClick={() => onUpdateTaskStatus(task.id, 'in_progress')}
            className="p-1 text-gray-600 hover:bg-gray-50 rounded"
            aria-label={`Start working on task "${task.title}"`}
          >
            <Play className="h-4 w-4" />
          </button>
        );
    }
  };

  return (
    <div className={`${level > 0 ? 'ml-8' : ''}`}>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, task.id)}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, task.id)}
        className={`bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 ${
          draggedTask === task.id ? 'opacity-50' : ''
        } ${task.status === 'completed' ? 'opacity-75' : ''}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-grow">
            <GripVertical className="h-4 w-4 text-gray-400 mt-1 cursor-move" />
            
            {getStatusButton(task)}
            
            <div className="flex-grow">
              <div className="flex items-center space-x-2 mb-2">
                {task.subtasks && task.subtasks.length > 0 && (
                  <button
                    onClick={() => onToggleExpansion(task.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                    aria-label={`${task.isExpanded ? 'Collapse' : 'Expand'} subtasks for ${task.title}`}
                  >
                    {task.isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                )}
                
                <h4 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {task.title}
                </h4>
                
                {task.recurrence_pattern && (
                  <Repeat className="h-4 w-4 text-blue-600" />
                )}
              </div>
              
              {task.description && (
                <p className="text-gray-600 text-sm mb-2">{task.description}</p>
              )}
              
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                
                {task.complexity && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-50 border border-yellow-200 rounded-full">
                    <Gauge className="h-3 w-3 text-yellow-600" />
                    <div className="flex space-x-0.5">
                      {getComplexityStars(task.complexity)}
                    </div>
                  </div>
                )}
                
                {task.estimated_time && (
                  <span className="flex items-center space-x-1 text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
                    <Clock className="h-3 w-3" />
                    <span>{task.estimated_time}</span>
                  </span>
                )}
                
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
                onSetShowTaskMenu(showTaskMenu === task.id ? null : task.id);
              }}
              className="p-1 text-gray-600 hover:bg-gray-50 rounded"
              aria-label={`More options for task: ${task.title}`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            
            {showTaskMenu === task.id && renderTaskMenu(task)}
          </div>
        </div>
      </div>
      
      {task.isExpanded && task.subtasks && task.subtasks.length > 0 && (
        <div className="mt-2 space-y-2">
          {task.subtasks.map((subtask: any) => (
            <TaskCard
              key={subtask.id}
              task={subtask}
              level={level + 1}
              draggedTask={draggedTask}
              showTaskMenu={showTaskMenu}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onToggleExpansion={onToggleExpansion}
              onUpdateTaskStatus={onUpdateTaskStatus}
              onSetShowTaskMenu={onSetShowTaskMenu}
              renderTaskMenu={renderTaskMenu}
            />
          ))}
        </div>
      )}
    </div>
  );
};
