import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ResponseDisplayProps {
  response: string;
  isLoading: boolean;
  onFeedback: (isHelpful: boolean) => void;
  feedbackSubmitted: boolean;
}

export function ResponseDisplay({ response, isLoading, onFeedback, feedbackSubmitted }: ResponseDisplayProps) {
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const handleFeedback = (isHelpful: boolean) => {
    onFeedback(isHelpful);
    setFeedbackGiven(true);
  };

  if (!response && !isLoading) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          <i className="fas fa-robot text-secondary mr-2"></i>
          AI Assistant Response
        </h3>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-slate-600">AI is thinking...</span>
          </div>
        ) : (
          <>
            <div className="prose max-w-none">
              <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-primary">
                <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {response}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <h4 className="font-medium text-slate-800 mb-3">Was this response helpful?</h4>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => handleFeedback(true)}
                  disabled={feedbackGiven || feedbackSubmitted}
                  className="bg-secondary text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-thumbs-up mr-2"></i>
                  Yes, helpful
                </Button>
                <Button
                  onClick={() => handleFeedback(false)}
                  disabled={feedbackGiven || feedbackSubmitted}
                  variant="secondary"
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-thumbs-down mr-2"></i>
                  Not helpful
                </Button>
              </div>
              {(feedbackGiven || feedbackSubmitted) && (
                <div className="mt-3 text-sm text-slate-600">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  Thank you for your feedback! It helps improve our AI responses.
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
