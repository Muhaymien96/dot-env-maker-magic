
import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { useTasksStore, useAuthStore } from '../store';
import { useAICoach } from '../hooks/useAICoach';
import { AICoachResponse } from './AICoachResponse';
import { TaskForm } from './TaskForm';
import { TaskCard } from './TaskCard';
import { TaskMenu } from './TaskMenu';
import { WorkloadBreakdown } from './WorkloadBreakdown';
import { TasksHeader } from './TasksHeader';
import { Task } from '../lib/supabase';

interface TaskSuggestion {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimated_time?: string;
  subtasks?: string[];
  tags?: string[];
  complexity?: number;
}

export const TaskManager: React.FC = () => {
  const { user } = useAuthStore();
  const {
    tasks,
    loading,
    error,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    reorderTask,
    toggleTaskExpansion,
    getTaskById
  } = useTasksStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [showTaskMenu, setShowTaskMenu] = useState<string | null>(null);

  const { getCoachingResponse, loading: aiLoading } = useAICoach();

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreateTask = async (formData: any) => {
    const coachingResponse = await getCoachingResponse({
      input: `${formData.title}. ${formData.description}`,
      type: 'task',
      context: {
        existing_tasks: tasks.map(t => t.title),
        user_id: user?.id,
        include_historical_data: true,
      }
    });

    if (coachingResponse) {
      setAiResponse(coachingResponse);
    }

    const taskData = {
      ...formData,
      status: 'pending' as Task['status'],
      priority: coachingResponse?.priority_suggestion || formData.priority,
      parent_task_id: formData.parent_task_id || undefined,
      recurrence_pattern: formData.recurrence_pattern || undefined,
      recurrence_end_date: formData.recurrence_end_date || undefined,
      due_date: formData.due_date || undefined,
    };

    const createdTask = await createTask(taskData);
    
    if (createdTask) {
      setShowAddForm(false);
    }
  };

  const handleWorkloadBreakdown = async (workloadInput: string) => {
    const response = await getCoachingResponse({
      input: workloadInput,
      type: 'brain_dump',
      context: {
        existing_tasks: tasks.map(t => t.title),
        user_id: user?.id,
        include_historical_data: true,
      }
    });

    if (response) {
      setAiResponse(response);
    }
  };

  const handleTaskAdd = async (taskSuggestion: TaskSuggestion) => {
    try {
      const taskData = {
        title: taskSuggestion.title,
        description: taskSuggestion.description,
        priority: taskSuggestion.priority,
        status: 'pending' as Task['status'],
        due_date: undefined,
        parent_task_id: undefined,
        recurrence_pattern: undefined,
        recurrence_end_date: undefined,
        tags: taskSuggestion.tags || [],
        complexity: taskSuggestion.complexity || 3,
      };

      const createdTask = await createTask(taskData);
      
      if (createdTask && taskSuggestion.subtasks?.length) {
        for (const subtaskTitle of taskSuggestion.subtasks) {
          const subtaskData = {
            title: subtaskTitle,
            description: `Subtask of: ${taskSuggestion.title}`,
            priority: 'medium' as Task['priority'],
            status: 'pending' as Task['status'],
            due_date: undefined,
            parent_task_id: createdTask.id,
            tags: ['subtask'],
            complexity: Math.max(1, (taskSuggestion.complexity || 3) - 1),
          };
          
          await createTask(subtaskData);
        }
      }
    } catch (error) {
      console.error('Error in handleTaskAdd:', error);
    }
  };

  const handleAddAllTasks = async (tasks: TaskSuggestion[]) => {
    if (!tasks?.length) return;

    try {
      for (const task of tasks) {
        await handleTaskAdd(task);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error('Error adding all tasks:', error);
    }
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task.id);
    setShowTaskMenu(null);
  };

  const handleUpdateTask = async (formData: any) => {
    if (!editingTask) return;

    await updateTask(editingTask, {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      due_date: formData.due_date || undefined,
      tags: formData.tags,
      complexity: formData.complexity,
    });

    setEditingTask(null);
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
    setShowTaskMenu(null);
  };

  const handleSubtaskAdd = async (subtaskTitle: string) => {
    const subtaskData = {
      title: subtaskTitle,
      description: 'Generated from AI coaching',
      priority: 'medium' as Task['priority'],
      status: 'pending' as Task['status'],
      due_date: undefined,
      parent_task_id: undefined,
      complexity: 2,
    };
    
    await createTask(subtaskData);
  };

  const handleUpdateTaskStatus = async (id: string, status: Task['status']) => {
    const updates: Partial<Task> = { status };
    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }
    
    await updateTask(id, updates);
    
    const task = getTaskById(id);
    if (status === 'completed' && task?.recurrence_pattern) {
      await createRecurringTask(task);
    }
  };

  const handleClearCompletedTasks = async () => {
    const completedTasks = tasks.filter(task => task.status === 'completed');
    for (const task of completedTasks) {
      await deleteTask(task.id);
    }
  };

  const createRecurringTask = async (completedTask: any) => {
    if (!completedTask.recurrence_pattern) return;
    
    const now = new Date();
    let nextDueDate = new Date(completedTask.due_date || now);
    
    switch (completedTask.recurrence_pattern) {
      case 'daily':
        nextDueDate.setDate(nextDueDate.getDate() + 1);
        break;
      case 'weekly':
        nextDueDate.setDate(nextDueDate.getDate() + 7);
        break;
      case 'monthly':
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
        break;
      case 'yearly':
        nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
        break;
    }
    
    const endDate = completedTask.recurrence_end_date ? new Date(completedTask.recurrence_end_date) : null;
    if (endDate && nextDueDate > endDate) {
      return;
    }
    
    await createTask({
      title: completedTask.title,
      description: completedTask.description,
      priority: completedTask.priority,
      status: 'pending' as Task['status'],
      due_date: nextDueDate.toISOString(),
      recurrence_pattern: completedTask.recurrence_pattern,
      recurrence_end_date: completedTask.recurrence_end_date,
      tags: completedTask.tags || [],
      complexity: completedTask.complexity || 3,
    });
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetTaskId: string) => {
    e.preventDefault();
    if (!draggedTask || draggedTask === targetTaskId) return;
    
    const targetTask = getTaskById(targetTaskId);
    if (targetTask) {
      reorderTask(draggedTask, (targetTask.task_order || 0) + 1);
    }
    setDraggedTask(null);
  };

  const renderTaskMenu = (task: any) => (
    <TaskMenu
      task={task}
      onEditTask={handleEditTask}
      onUpdateTaskStatus={handleUpdateTaskStatus}
      onDeleteTask={handleDeleteTask}
    />
  );

  useEffect(() => {
    const handleClickOutside = () => {
      if (showTaskMenu) {
        setShowTaskMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showTaskMenu]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const completedTasksCount = tasks.filter(task => task.status === 'completed').length;
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    return (a.task_order || 0) - (b.task_order || 0);
  });

  return (
    <div className="space-y-6">
      <TasksHeader 
        completedTasksCount={completedTasksCount}
        onAddTask={() => setShowAddForm(true)}
        onClearCompleted={handleClearCompletedTasks}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <WorkloadBreakdown
        onBreakdown={handleWorkloadBreakdown}
        aiLoading={aiLoading}
      />

      {aiResponse && (
        <AICoachResponse 
          response={aiResponse} 
          onSubtaskAdd={handleSubtaskAdd}
          onTaskAdd={handleTaskAdd}
          onAddAllTasks={handleAddAllTasks}
          onRejectSuggestions={() => setAiResponse(null)}
        />
      )}

      {showAddForm && (
        <TaskForm
          onSave={handleCreateTask}
          onCancel={() => setShowAddForm(false)}
          availableTasks={tasks}
        />
      )}

      {editingTask && (
        <TaskForm
          isEditing
          task={getTaskById(editingTask)}
          onSave={handleUpdateTask}
          onCancel={() => setEditingTask(null)}
          availableTasks={tasks}
        />
      )}

      <div className="space-y-3">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h4>
            <p className="text-gray-600">Create your first task or try the workload breakdown feature!</p>
          </div>
        ) : (
          sortedTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              draggedTask={draggedTask}
              showTaskMenu={showTaskMenu}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onToggleExpansion={toggleTaskExpansion}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onSetShowTaskMenu={setShowTaskMenu}
              renderTaskMenu={renderTaskMenu}
            />
          ))
        )}
      </div>
    </div>
  );
};
