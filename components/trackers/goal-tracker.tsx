"use client";

import { motion } from "framer-motion";
import { useGoalStore, type Goal } from "@/store/useGoalStore";
import { Check, Circle, Target } from "lucide-react";

interface GoalTrackerProps {
  category?: Goal["category"];
  limit?: number;
}

export function GoalTracker({ category, limit }: GoalTrackerProps) {
  const { goals, toggleMilestone } = useGoalStore();

  const filteredGoals = category
    ? goals.filter((g) => g.category === category)
    : goals;

  const displayGoals = limit ? filteredGoals.slice(0, limit) : filteredGoals;

  return (
    <div className="space-y-4">
      {displayGoals.map((goal, index) => (
        <motion.div
          key={goal.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="rounded-xl border border-white/10 bg-white/5 p-5"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white">{goal.title}</h4>
                <p className="text-xs text-white/50">
                  Target: {new Date(goal.targetDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <span className="text-lg font-bold text-purple-400">
              {goal.progress}%
            </span>
          </div>

          <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${goal.progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
            />
          </div>

          <div className="space-y-2">
            {goal.milestones.map((milestone) => (
              <button
                key={milestone.id}
                onClick={() => toggleMilestone(goal.id, milestone.id)}
                className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-white/5"
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    milestone.completed
                      ? "bg-green-500 text-white"
                      : "border border-white/30 text-white/30"
                  }`}
                >
                  {milestone.completed ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Circle className="h-3.5 w-3.5" />
                  )}
                </div>
                <span
                  className={`flex-1 text-sm ${
                    milestone.completed
                      ? "text-white/50 line-through"
                      : "text-white/80"
                  }`}
                >
                  {milestone.title}
                </span>
                {milestone.completedDate && (
                  <span className="text-xs text-white/30">
                    {new Date(milestone.completedDate).toLocaleDateString()}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
