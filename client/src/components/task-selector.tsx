import { cn } from "@/lib/utils";

interface TaskSelectorProps {
  currentTask: string;
  onTaskChange: (task: string) => void;
}

const tasks = [
  {
    id: "question",
    label: "Question",
    icon: "fas fa-question-circle",
    colors: "border-primary bg-primary/5 text-primary hover:bg-primary/10"
  },
  {
    id: "summary", 
    label: "Summary",
    icon: "fas fa-file-text",
    colors: "border-secondary bg-secondary/5 text-secondary hover:bg-secondary/10"
  },
  {
    id: "creative",
    label: "Creative", 
    icon: "fas fa-lightbulb",
    colors: "border-purple-500 bg-purple-50 text-purple-500 hover:bg-purple-100"
  },
  {
    id: "advice",
    label: "Advice",
    icon: "fas fa-compass", 
    colors: "border-amber-500 bg-amber-50 text-amber-500 hover:bg-amber-100"
  }
];

export function TaskSelector({ currentTask, onTaskChange }: TaskSelectorProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-slate-700 mb-3">Select Task Type</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {tasks.map((task) => (
          <button
            key={task.id}
            onClick={() => onTaskChange(task.id)}
            className={cn(
              "flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-200",
              currentTask === task.id
                ? task.colors
                : "border-slate-200 text-slate-600 hover:border-slate-300"
            )}
          >
            <i className={`${task.icon} text-xl mb-1`}></i>
            <span className="text-xs font-medium">{task.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
