import { Card, CardContent } from "@/components/ui/card";

interface SidebarProps {
  sessionStats: {
    queriesCount: number;
    helpfulCount: number;
    successRate: number;
  };
  onExampleClick: (example: string) => void;
}

const examples = [
  {
    bracket: "[question]",
    text: "What is the capital of France?",
    color: "text-blue-600",
    description: "What is the capital of France?"
  },
  {
    bracket: "[summary]",
    text: "[summary] Summarize this: Artificial intelligence is rapidly transforming industries worldwide by automating processes, improving decision-making, and creating new opportunities for innovation.",
    color: "text-green-600",
    description: "Summarize a text passage"
  },
  {
    bracket: "[creative]",
    text: "[creative] Write a short poem about autumn",
    color: "text-purple-600",
    description: "Write a short poem about autumn"
  },
  {
    bracket: "[advice]",
    text: "[advice] How can I improve my study habits?",
    color: "text-amber-600",
    description: "How can I improve study habits?"
  }
];

export function Sidebar({ sessionStats, onExampleClick }: SidebarProps) {
  return (
    <div className="space-y-6">
      {/* Quick Examples */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            <i className="fas fa-star text-accent mr-2"></i>
            Quick Examples
          </h3>
          <div className="space-y-3">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => onExampleClick(example.text)}
                className="w-full text-left p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200"
              >
                <div className={`text-xs font-mono mb-1 ${example.color}`}>
                  {example.bracket}
                </div>
                <div className="text-sm text-slate-700">{example.description}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            <i className="fas fa-chart-bar text-secondary mr-2"></i>
            Session Stats
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Queries Asked</span>
              <span className="font-semibold text-slate-900">{sessionStats.queriesCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Helpful Responses</span>
              <span className="font-semibold text-slate-900">{sessionStats.helpfulCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Success Rate</span>
              <span className="font-semibold text-secondary">{sessionStats.successRate}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Info */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">
          <i className="fas fa-graduation-cap text-purple-600 mr-2"></i>
          About This Project
        </h3>
        <p className="text-sm text-slate-700 mb-3">
          This AI Assistant demonstrates effective prompt engineering techniques using bracket-based task categorization.
        </p>
        <div className="space-y-2 text-xs text-slate-600">
          <div className="flex items-center">
            <i className="fas fa-check text-green-500 mr-2"></i>
            <span>Multi-function AI integration</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-check text-green-500 mr-2"></i>
            <span>User feedback collection</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-check text-green-500 mr-2"></i>
            <span>Responsive web interface</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-check text-green-500 mr-2"></i>
            <span>Prompt variation showcase</span>
          </div>
        </div>
      </div>
    </div>
  );
}
