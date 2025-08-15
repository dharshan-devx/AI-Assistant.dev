import { AIAssistant } from "@/components/ai-assistant";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-primary rounded-lg p-2">
                <i className="fas fa-robot text-white text-xl"></i>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">AI Assistant</h1>
                <p className="text-sm text-slate-600">Prompt Engineering Project</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-slate-100 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-slate-700">Academic Demo</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Instructions Section */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">
            <i className="fas fa-info-circle text-primary mr-2"></i>
            How to Use This AI Assistant
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-slate-800 mb-2">Available Functions</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono mr-2">[question]</span>
                  <span>Answer factual questions</span>
                </div>
                <div className="flex items-center">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono mr-2">[summary]</span>
                  <span>Summarize provided text</span>
                </div>
                <div className="flex items-center">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-mono mr-2">[creative]</span>
                  <span>Generate creative content</span>
                </div>
                <div className="flex items-center">
                  <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-mono mr-2">[advice]</span>
                  <span>Provide practical advice</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-slate-800 mb-2">Example Usage</h3>
              <div className="bg-white rounded-lg p-3 text-sm">
                <div className="text-slate-500 mb-1">Type your request like:</div>
                <code className="text-slate-700">[question] What is machine learning?</code>
              </div>
            </div>
          </div>
        </div>

        <AIAssistant />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-sm text-slate-600">
              AI Assistant ~ For Educational Purposes Only
            </div>
            <div className="text-sm text-slate-500 mt-2 sm:mt-0">
              Built with modern web technologies and AI integration
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
