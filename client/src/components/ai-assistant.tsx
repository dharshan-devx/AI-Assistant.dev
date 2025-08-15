import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAIAssistant } from "@/hooks/use-ai-assistant";
import { TaskSelector } from "./task-selector";
import { ResponseDisplay } from "./response-display";
import { Sidebar } from "./sidebar";

const placeholders = {
  question: "[question] What is artificial intelligence and how does it work?",
  summary: "[summary] Summarize this: [Your text here]",
  creative: "[creative] Write a short story about a magical forest",
  advice: "[advice] How can I improve my time management skills?"
};

export function AIAssistant() {
  const [currentTask, setCurrentTask] = useState("question");
  const [input, setInput] = useState("");
  const [charCount, setCharCount] = useState(0);
  const { toast } = useToast();
  
  const {
    submitQuery,
    submitFeedback,
    sessionStats,
    isLoading,
    error,
    currentResponse,
    feedbackSubmitted
  } = useAIAssistant();

  useEffect(() => {
    setCharCount(input.length);
  }, [input]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const handleSubmit = async () => {
    const trimmedInput = input.trim();
    
    if (!trimmedInput) {
      toast({
        title: "Input Required",
        description: "Please enter your query first.",
        variant: "destructive"
      });
      return;
    }

    // Validate bracket format
    const bracketPattern = new RegExp(`^\\[${currentTask}\\]`);
    if (!bracketPattern.test(trimmedInput)) {
      toast({
        title: "Format Error",
        description: `Please start your query with [${currentTask}]`,
        variant: "destructive"
      });
      return;
    }

    try {
      await submitQuery(trimmedInput, currentTask);
      toast({
        title: "Success",
        description: "AI response received successfully!",
      });
    } catch (err) {
      // Error is handled by the useEffect above
    }
  };

  const handleClear = () => {
    setInput("");
    setCharCount(0);
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
    setCharCount(example.length);
    
    // Extract task type from example
    const taskMatch = example.match(/^\[(\w+)\]/);
    if (taskMatch) {
      setCurrentTask(taskMatch[1]);
    }
  };

  const handleFeedback = async (isHelpful: boolean) => {
    try {
      await submitFeedback(isHelpful);
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2">
        {/* Input Section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              <i className="fas fa-edit text-primary mr-2"></i>
              Your Query
            </h2>
            
            <TaskSelector currentTask={currentTask} onTaskChange={setCurrentTask} />

            <div className="mb-6">
              <label htmlFor="user-input" className="block text-sm font-medium text-slate-700 mb-2">
                Your Input
              </label>
              <div className="relative">
                <Textarea
                  id="user-input"
                  rows={6}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={placeholders[currentTask as keyof typeof placeholders]}
                  className="resize-none"
                  maxLength={1000}
                />
                <div className="absolute top-3 right-3">
                  <span className={`text-xs ${charCount > 900 ? 'text-red-500' : 'text-slate-400'}`}>
                    {charCount} / 1000
                  </span>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                <i className="fas fa-info-circle mr-1"></i>
                Start your message with [question], [summary], [creative], or [advice] to specify the task type.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 bg-primary text-white hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    Send to AI Assistant
                  </>
                )}
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                disabled={isLoading}
              >
                <i className="fas fa-eraser mr-2"></i>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Response Section */}
        {(currentResponse || isLoading) && (
          <ResponseDisplay
            response={currentResponse?.response || ""}
            isLoading={isLoading}
            onFeedback={handleFeedback}
            feedbackSubmitted={feedbackSubmitted}
          />
        )}
      </div>

      {/* Sidebar */}
      <div>
        <Sidebar
          sessionStats={sessionStats}
          onExampleClick={handleExampleClick}
        />
      </div>
    </div>
  );
}
