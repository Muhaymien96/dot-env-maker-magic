
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useTasksStore } from '../store';
import { TaskForm } from './TaskForm';
import { SimpleTaskCard } from './SimpleTaskCard';
import { WorkloadBreakdown } from './WorkloadBreakdown';
import { TasksHeader } from './TasksHeader';
import { Task } from '../lib/supabase';

export interface ExtendedTask extends Task {
  subtasks?: ExtendedTask[];
  isExpanded?: boolean;
}

export const TaskManager: React.FC = () => {
  const { 
    tasks, 
    loading, 
    error, 
    loadTasks, 
    createTask, 
    updateTask, 
    deleteTask 
  } = useTasksStore();

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<ExtendedTask | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Convert database status to component status
  const convertStatus = (dbStatus: Task['status']): 'todo' | 'in_progress' | 'completed' => {
    if (dbStatus === 'pending') return 'todo';
    return dbStatus as 'todo' | 'in_progress' | 'completed';
  };

  // Convert component status to database status
  const convertToDbStatus = (status: 'todo' | 'in_progress' | 'completed'): Task['status'] => {
    if (status === 'todo') return 'pending';
    return status;
  };

  const extendedTasks: ExtendedTask[] = tasks.map(task => ({
    ...task,
    status: convertStatus(task.status),
    subtasks: [],
    isExpanded: false
  }));

  const handleCreateTask = async (formData: any) => {
    try {
      await createTask({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        due_date: formData.due_date,
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
      await updateTask(taskId, { status: convertToDbStatus(status) });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleEditTask = (task: ExtendedTask) => {
    setEditingTask(task);
  };

  const handleWorkloadBreakdown = async (input: string) => {
    setAiLoading(true);
    try {
      // Simple AI breakdown simulation
      const breakdown = [
        { title: `Research: ${input}`, priority: 'medium' as const },
        { title: `Plan: ${input}`, priority: 'high' as const },
        { title: `Execute: ${input}`, priority: 'medium' as const },
        { title: `Review: ${input}`, priority: 'low' as const }
      ];
      
      for (const task of breakdown) {
        await createTask({
          title: task.title,
          description: `Auto-generated from: ${input}`,
          priority: task.priority,
          tags: ['ai-generated']
        });
      }
    } catch (error) {
      console.error('Error breaking down workload:', error);
    } finally {
      setAiLoading(false);
    }
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
          onClick={() => loadTasks()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const completedTasksCount = extendedTasks.filter(task => task.status === 'completed').length;

  return (
    <div className="space-y-6">
      <TasksHeader
        completedTasksCount={completedTasksCount}
        onAddTask={() => setShowForm(true)}
        onClearCompleted={async () => {
          const completedTasks = extendedTasks.filter(task => task.status === 'completed');
          for (const task of completedTasks) {
            await handleDeleteTask(task.id);
          }
        }}
      />

      <WorkloadBreakdown
        onBreakdown={handleWorkloadBreakdown}
        aiLoading={aiLoading}
      />

      {/* Task Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setShowForm(false)}
            availableTasks={extendedTasks}
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
            availableTasks={extendedTasks}
          />
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-4">
        {extendedTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500 mb-4">Create your first task to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Task
            </button>
          </div>
        ) : (
          extendedTasks.map((task) => (
            <SimpleTaskCard
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
};
