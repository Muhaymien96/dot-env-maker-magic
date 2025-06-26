
import React, { useState } from 'react';
import { X, Plus, Calendar, Clock, Flag, Hash, Zap, User } from 'lucide-react';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: any) => void;
  initialTask?: any;
  isEdit?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTask,
  isEdit = false
}) => {
  const [task, setTask] = useState({
    title: initialTask?.title || '',
    description: initialTask?.description || '',
    priority: initialTask?.priority || 'medium',
    due_date: initialTask?.due_date || '',
    estimated_duration: initialTask?.estimated_duration || 60,
    tags: initialTask?.tags || [],
    energy_level: initialTask?.energy_level || 'medium',
    context: initialTask?.context || '',
    subtasks: initialTask?.subtasks || []
  });

  const [newTag, setNewTag] = useState('');
  const [newSubtask, setNewSubtask] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(task);
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !task.tags.includes(newTag.trim())) {
      setTask({
        ...task,
        tags: [...task.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTask({
      ...task,
      tags: task.tags.filter((t: string) => t !== tag)
    });
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setTask({
        ...task,
        subtasks: [...task.subtasks, { 
          title: newSubtask.trim(), 
          completed: false,
          id: Date.now().toString()
        }]
      });
      setNewSubtask('');
    }
  };

  const removeSubtask = (index: number) => {
    setTask({
      ...task,
      subtasks: task.subtasks.filter((_: any, i: number) => i !== index)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="What needs to be done?"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Description
            </label>
            <textarea
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Add more details about this task..."
              rows={3}
            />
          </div>

          {/* Priority & Energy Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                <Flag className="inline h-4 w-4 mr-1" />
                Priority
              </label>
              <select
                value={task.priority}
                onChange={(e) => setTask({ ...task, priority: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                <Zap className="inline h-4 w-4 mr-1" />
                Energy Level Required
              </label>
              <select
                value={task.energy_level}
                onChange={(e) => setTask({ ...task, energy_level: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="low">Low Energy</option>
                <option value="medium">Medium Energy</option>
                <option value="high">High Energy</option>
              </select>
            </div>
          </div>

          {/* Due Date & Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Due Date
              </label>
              <input
                type="date"
                value={task.due_date}
                onChange={(e) => setTask({ ...task, due_date: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                Estimated Duration (minutes)
              </label>
              <input
                type="number"
                value={task.estimated_duration}
                onChange={(e) => setTask({ ...task, estimated_duration: parseInt(e.target.value) || 0 })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="5"
                step="5"
              />
            </div>
          </div>

          {/* Context */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              <User className="inline h-4 w-4 mr-1" />
              Context/Location
            </label>
            <input
              type="text"
              value={task.context}
              onChange={(e) => setTask({ ...task, context: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="e.g., @home, @office, @computer"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              <Hash className="inline h-4 w-4 mr-1" />
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Add a tag..."
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {task.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 p-0.5 hover:bg-indigo-200 rounded-full transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Subtasks */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Subtasks
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Add a subtask..."
              />
              <button
                type="button"
                onClick={addSubtask}
                className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {task.subtasks.map((subtask: any, index: number) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <span className="flex-1">{subtask.title}</span>
                  <button
                    type="button"
                    onClick={() => removeSubtask(index)}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              {isEdit ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
