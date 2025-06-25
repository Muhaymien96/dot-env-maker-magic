
import React from 'react';
import { 
  X, 
  Plus, 
  Brain, 
  Clock, 
  Tag,
  Star,
  Lightbulb,
  AlertTriangle
} from 'lucide-react';

interface TaskSuggestion {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimated_time?: string;
  subtasks?: string[];
  tags?: string[];
  complexity?: number;
}

interface AICoachResponseProps {
  response: {
    suggestions?: TaskSuggestion[];
    insights?: string[];
    priority_suggestion?: 'low' | 'medium' | 'high';
    coaching_message?: string;
    breakdown?: {
      tasks: TaskSuggestion[];
      insights: string[];
      time_estimate: string;
      complexity_analysis: string;
    };
    message?: string;
  };
  onSubtaskAdd?: (subtask: string, parentId?: string) => void;
  onTaskAdd?: (task: TaskSuggestion) => void;
  onAddAllTasks?: (tasks: TaskSuggestion[]) => void;
  onRejectSuggestions?: () => void;
}

export const AICoachResponse: React.FC<AICoachResponseProps> = ({
  response,
  onSubtaskAdd,
  onTaskAdd,
  onAddAllTasks,
  onRejectSuggestions
}) => {
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

  if (!response) return null;

  const tasks = response.breakdown?.tasks || response.suggestions || [];
  const insights = response.breakdown?.insights || response.insights || [];
  const message = response.coaching_message || response.message || '';

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-purple-900 flex items-center space-x-2">
          <Brain className="h-5 w-5" />
          <span>AI Coach Response</span>
        </h4>
        {onRejectSuggestions && (
          <button
            onClick={onRejectSuggestions}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Dismiss AI suggestions"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {message && (
        <div className="bg-white/70 p-4 rounded-lg border border-purple-200">
          <p className="text-purple-800">{message}</p>
        </div>
      )}

      {insights.length > 0 && (
        <div className="bg-white/70 p-4 rounded-lg border border-purple-200">
          <h5 className="font-medium text-purple-900 mb-2 flex items-center space-x-2">
            <Lightbulb className="h-4 w-4" />
            <span>Insights</span>
          </h5>
          <ul className="space-y-1">
            {insights.map((insight, index) => (
              <li key={index} className="text-purple-700 text-sm">• {insight}</li>
            ))}
          </ul>
        </div>
      )}

      {tasks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="font-medium text-purple-900 flex items-center space-x-2">
              <span>Suggested Tasks ({tasks.length})</span>
            </h5>
            {onAddAllTasks && (
              <button
                onClick={() => onAddAllTasks(tasks)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                Add All Tasks
              </button>
            )}
          </div>

          <div className="space-y-3">
            {tasks.map((task, taskIndex) => (
              <div key={taskIndex} className="bg-white/70 p-4 rounded-lg border border-purple-200">
                <div className="flex items-start justify-between mb-2">
                  <h6 className="font-medium text-purple-900">{task.title}</h6>
                  {onTaskAdd && (
                    <button
                      onClick={() => onTaskAdd(task)}
                      className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors flex items-center space-x-1"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add</span>
                    </button>
                  )}
                </div>

                <p className="text-purple-700 text-sm mb-3">{task.description}</p>

                <div className="flex items-center flex-wrap gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>

                  {task.complexity && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-50 border border-yellow-200 rounded-full">
                      <div className="flex space-x-0.5">
                        {getComplexityStars(task.complexity)}
                      </div>
                    </div>
                  )}

                  {task.estimated_time && (
                    <span className="flex items-center space-x-1 text-xs text-gray-600 px-2 py-1 bg-gray-100 rounded-full">
                      <Clock className="h-3 w-3" />
                      <span>{task.estimated_time}</span>
                    </span>
                  )}

                  {task.tags && task.tags.map(tag => (
                    <span key={tag} className="flex items-center space-x-1 text-xs text-gray-600 px-2 py-1 bg-gray-100 rounded-full">
                      <Tag className="h-3 w-3" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>

                {task.subtasks && task.subtasks.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-purple-800 mb-2">Subtasks:</p>
                    <ul className="space-y-1">
                      {task.subtasks.map((subtask, subtaskIndex) => (
                        <li key={subtaskIndex} className="flex items-center justify-between text-sm text-purple-700">
                          <span>• {subtask}</span>
                          {onSubtaskAdd && (
                            <button
                              onClick={() => onSubtaskAdd(subtask)}
                              className="text-purple-600 hover:text-purple-800 text-xs"
                            >
                              Add
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {response.breakdown?.time_estimate && (
        <div className="bg-white/70 p-3 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-700">
            <strong>Estimated Time:</strong> {response.breakdown.time_estimate}
          </p>
        </div>
      )}

      {response.breakdown?.complexity_analysis && (
        <div className="bg-white/70 p-3 rounded-lg border border-purple-200">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-purple-900">Complexity Analysis</p>
              <p className="text-sm text-purple-700">{response.breakdown.complexity_analysis}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
