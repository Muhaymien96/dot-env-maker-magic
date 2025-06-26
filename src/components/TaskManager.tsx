import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useTaskStore } from '../store';
import { TaskForm } from './TaskForm';
import { TaskCard } from './TaskCard';
import { TaskMenu } from './TaskMenu';
import { WorkloadBreakdown } from './WorkloadBreakdown';
import { TasksHeader } from './TasksHeader';

export interface ExtendedTask {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'completed';
  due_date?: string;
  estimated_duration?: number;
  energy_required?: 'low' | 'medium' | 'high';
  focus_required?: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
  user_id: string;
  dependencies?: string[];
  subtasks?: ExtendedTask[];
  tags?: string[];
}

export const TaskManager: React.FC = () => {
  const { 
    tasks, 
    loading, 
    error, 
    fetchTasks, 
    createTask, 
    updateTask, 
    deleteTask 
  } = useTaskStore();

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<ExtendedTask | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'todo' | 'in_progress' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'due_date' | 'priority' | 'created_at'>('created_at');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const getFilteredTasks = () => {
    let filteredTasks = [...tasks];

    if (searchQuery) {
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (filterStatus !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.status === filterStatus);
    }

    if (filterPriority !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.priority === filterPriority);
    }

    return filteredTasks;
  };

  const getSortedTasks = (tasks: ExtendedTask[]) => {
    let sortedTasks = [...tasks];

    sortedTasks.sort((a, b) => {
      if (sortBy === 'due_date') {
        const dateA = a.due_date ? new Date(a.due_date).getTime() : Infinity;
        const dateB = b.due_date ? new Date(b.due_date).getTime() : Infinity;
        return dateA - dateB;
      } else if (sortBy === 'priority') {
        const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
        return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
      } else {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return sortedTasks;
  };

  const filteredAndSortedTasks = getSortedTasks(getFilteredTasks());

  const handleCreateTask = async (formData: any) => {
    try {
      await createTask({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        due_date: formData.due_date,
        estimated_duration: formData.estimated_duration,
        energy_required: formData.energy_required,
        focus_required: formData.focus_required,
        dependencies: formData.dependencies || [],
        tags: formData.tags || []
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (formData: any) => {
    if (!editingTask) return;
    
    try {
      await updateTask(editingTask.id, {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        due_date: formData.due_date,
        estimated_duration: formData.estimated_duration,
        energy_required: formData.energy_required,
        focus_required: formData.focus_required,
        dependencies: formData.dependencies || [],
        tags: formData.tags || []
      });
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleStatusChange = async (taskId: string, status: 'todo' | 'in_progress' | 'completed') => {
    try {
      await updateTask(taskId, { status });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleEditTask = (task: ExtendedTask) => {
    setEditingTask(task);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error loading tasks: {error}</p>
        <button 
          onClick={() => fetchTasks()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TasksHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onCreateTask={() => setShowForm(true)}
      />

      <WorkloadBreakdown tasks={tasks} />

      {/* Task Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setShowForm(false)}
            availableTasks={tasks}
          />
        </div>
      )}

      {editingTask && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <TaskForm
            task={editingTask}
            isEdit={true}
            onSubmit={handleUpdateTask}
            onCancel={() => setEditingTask(null)}
            availableTasks={tasks}
          />
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredAndSortedTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || filterStatus !== 'all' || filterPriority !== 'all' 
                ? 'Try adjusting your filters or search query'
                : 'Create your first task to get started'
              }
            </p>
            {!searchQuery && filterStatus === 'all' && filterPriority === 'all' && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Task
              </button>
            )}
          </div>
        ) : (
          filteredAndSortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
};
