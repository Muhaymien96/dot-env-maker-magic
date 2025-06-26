
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Zap, Target, Tag, Link } from 'lucide-react';
import { ExtendedTask } from './TaskManager';

export interface TaskFormProps {
  task?: ExtendedTask;
  isEdit?: boolean;
  onSubmit: (formData: any) => Promise<void>;
  onCancel: () => void;
  availableTasks: ExtendedTask[];
}

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  isEdit = false,
  onSubmit,
  onCancel,
  availableTasks
}) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium' as 'low' | 'medium' | 'high',
    due_date: task?.due_date || '',
    estimated_duration: task?.estimated_duration || 30,
    energy_required: task?.energy_required || 'medium' as 'low' | 'medium' | 'high',
    focus_required: task?.focus_required || 'medium' as 'low' | 'medium' | 'high',
    dependencies: task?.dependencies || [],
    tags: task?.tags || []
  });

  const [newTag, setNewTag] = useState('');
  const [showDependencies, setShowDependencies] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    await onSubmit(formData);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(newTag.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag.trim()]
        }));
      }
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleDependencyToggle = (taskId: string) => {
    setFormData(prev => ({
      ...prev,
      dependencies: prev.dependencies.includes(taskId)
        ? prev.dependencies.filter(id => id !== taskId)
        : [...prev.dependencies, taskId]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {isEdit ? 'Edit Task' : 'Create New Task'}
        </h3>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Task Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="What needs to be done?"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Add more details about this task..."
        />
      </div>

      {/* Priority and Due Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              priority: e.target.value as 'low' | 'medium' | 'high' 
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4 inline mr-1" />
            Due Date
          </label>
          <input
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Duration and Requirements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="h-4 w-4 inline mr-1" />
            Duration (min)
          </label>
          <input
            type="number"
            value={formData.estimated_duration}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              estimated_duration: parseInt(e.target.value) || 30 
            }))}
            min="5"
            step="5"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Zap className="h-4 w-4 inline mr-1" />
            Energy Level
          </label>
          <select
            value={formData.energy_required}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              energy_required: e.target.value as 'low' | 'medium' | 'high' 
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="low">Low Energy</option>
            <option value="medium">Medium Energy</option>
            <option value="high">High Energy</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Target className="h-4 w-4 inline mr-1" />
            Focus Level
          </label>
          <select
            value={formData.focus_required}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              focus_required: e.target.value as 'low' | 'medium' | 'high' 
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="low">Low Focus</option>
            <option value="medium">Medium Focus</option>
            <option value="high">High Focus</option>
          </select>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Tag className="h-4 w-4 inline mr-1" />
          Tags
        </label>
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleAddTag}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Type a tag and press Enter"
        />
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Dependencies */}
      {availableTasks.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowDependencies(!showDependencies)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
          >
            <Link className="h-4 w-4" />
            Dependencies
          </button>
          
          {showDependencies && (
            <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {availableTasks
                .filter(t => t.id !== task?.id)
                .map((availableTask) => (
                  <label key={availableTask.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.dependencies.includes(availableTask.id)}
                      onChange={() => handleDependencyToggle(availableTask.id)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{availableTask.title}</span>
                  </label>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {isEdit ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};
