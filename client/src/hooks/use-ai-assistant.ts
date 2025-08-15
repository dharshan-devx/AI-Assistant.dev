import { useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface AIResponse {
  id: number;
  response: string;
  taskType: string;
}

export interface SessionStats {
  queriesCount: number;
  helpfulCount: number;
  successRate: number;
}

export function useAIAssistant() {
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [currentResponseId, setCurrentResponseId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  // AI Chat mutation
  const chatMutation = useMutation({
    mutationFn: async ({ input, taskType }: { input: string; taskType: string }) => {
      const response = await apiRequest("POST", "/api/ai/chat", { input, taskType });
      return await response.json() as AIResponse;
    },
    onSuccess: (data) => {
      setCurrentResponseId(data.id);
      // Invalidate stats to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["/api/stats", sessionId] });
    },
  });

  // Feedback mutation
  const feedbackMutation = useMutation({
    mutationFn: async ({ id, isHelpful }: { id: number; isHelpful: boolean }) => {
      const response = await apiRequest("POST", "/api/ai/feedback", { id, isHelpful });
      return await response.json();
    },
    onSuccess: (_, { isHelpful }) => {
      // Update session stats
      const currentStats = queryClient.getQueryData(["/api/stats", sessionId]) as SessionStats;
      if (currentStats) {
        const newHelpfulCount = isHelpful ? currentStats.helpfulCount + 1 : currentStats.helpfulCount;
        const newQueriesCount = currentStats.queriesCount + 1;
        
        // Update stats on server
        apiRequest("POST", `/api/stats/${sessionId}`, {
          queriesCount: newQueriesCount,
          helpfulCount: newHelpfulCount
        });
      }
      
      // Invalidate stats to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["/api/stats", sessionId] });
    },
  });

  // Session stats query
  const { data: sessionStats, isLoading: statsLoading } = useQuery<SessionStats>({
    queryKey: ["/api/stats", sessionId],
    staleTime: 0,
  });

  const submitQuery = useCallback(async (input: string, taskType: string) => {
    return chatMutation.mutateAsync({ input, taskType });
  }, [chatMutation]);

  const submitFeedback = useCallback(async (isHelpful: boolean) => {
    if (currentResponseId !== null) {
      await feedbackMutation.mutateAsync({ id: currentResponseId, isHelpful });
    }
  }, [currentResponseId, feedbackMutation]);

  return {
    submitQuery,
    submitFeedback,
    sessionStats: sessionStats || { queriesCount: 0, helpfulCount: 0, successRate: 0 },
    isLoading: chatMutation.isPending,
    error: chatMutation.error,
    currentResponse: chatMutation.data,
    feedbackSubmitted: feedbackMutation.isSuccess,
    statsLoading,
    sessionId
  };
}
