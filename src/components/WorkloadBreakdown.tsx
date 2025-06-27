
import React, { useState } from 'react';
import { Brain, Lightbulb } from 'lucide-react';
import { useAICoach } from '../hooks/useAICoach';
import { AICoachResponse } from './AICoachResponse';

interface TaskSuggestion {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimated_time?: string;
  subtasks?: string[];
  tags?: string[];
  complexity?: number;
}

interface WorkloadBreakdownProps {
  aiLoading: boolean;
  onTaskAdd?: (task: TaskSuggestion) => void;
  onAddAllTasks?: (tasks: TaskSuggestion[]) => void;
}

export const WorkloadBreakdown: React.FC<WorkloadBreakdownProps> = ({
  aiLoading,
  onTaskAdd,
  onAddAllTasks
}) => {
  const [workloadInput, setWorkloadInput] = useState('');
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [suggestedTasks, setSuggestedTasks] = useState<TaskSuggestion[]>([]);
  const { getCoachingResponse, loading: aiCoachLoading } = useAICoach();

  const handleBreakdown = async () => {
    if (!workloadInput.trim()) return;

    try {
      const response = await getCoachingResponse({
        input: workloadInput,
        type: 'task',
        context: {
          include_historical_data: true
        }
      });

      if (response) {
        setAiResponse(response);
        // Extract suggested tasks from the response
        if (response.suggested_tasks) {
          setSuggestedTasks(response.suggested_tasks);
        }
      }
      
      setWorkloadInput('');
    } catch (error) {
      console.error('Error getting AI breakdown:', error);
    }
  };

  const handleTaskAdd = async (task: TaskSuggestion) => {
    if (onTaskAdd) {
      await onTaskAdd(task);
      // Remove only this specific task from suggested tasks after successful addition
      setSuggestedTasks(prev => prev.filter(t => t.title !== task.title));
    }
  };

  const handleAddAllTasks = async () => {
    if (onAddAllTasks && suggestedTasks.length > 0) {
      await onAddAllTasks(suggestedTasks);
      setSuggestedTasks([]); // Clear all suggested tasks after adding all
    }
  };

  const handleRejectSuggestions = () => {
    setAiResponse(null);
    setSuggestedTasks([]);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-6 w-6 text-purple-600" />
          <h4 className="text-lg font-semibold text-purple-900">AI Workload Breakdown</h4>
        </div>
        <p className="text-purple-700 mb-4 text-sm">
          Describe your workload and AI will break it down into manageable tasks with complexity ratings.
        </p>
        <div className="space-y-3">
          <textarea
            value={workloadInput}
            onChange={(e) => setWorkloadInput(e.target.value)}
            placeholder="Example: 'I need to plan my wedding in 6 months with a $15k budget...'"
            rows={4}
            className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
          <div className="flex justify-end">
            <button
              onClick={handleBreakdown}
              disabled={aiCoachLoading || aiLoading || !workloadInput.trim()}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {(aiCoachLoading || aiLoading) ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Lightbulb className="h-4 w-4" />
                  <span>Break Down</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {aiResponse && suggestedTasks.length > 0 && (
        <AICoachResponse
          response={{
            ...aiResponse,
            suggestions: suggestedTasks
          }}
          onTaskAdd={handleTaskAdd}
          onAddAllTasks={handleAddAllTasks}
          onRejectSuggestions={handleRejectSuggestions}
        />
      )}
    </div>
  );
};
