"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Circle } from "lucide-react";
import { useHabitStore, type Habit } from "@/store/useHabitStore";

interface HabitTrackerProps {
  category?: Habit["category"];
}

export function HabitTracker({ category }: HabitTrackerProps) {
  const { habits, toggleHabit } = useHabitStore();
  const today = new Date().toISOString().split("T")[0];

  const filteredHabits = category
    ? habits.filter((h) => h.category === category)
    : habits;

  return (
    <div className="space-y-3">
      {filteredHabits.map((habit, index) => {
        const isCompleted = habit.completedDates.includes(today);

        return (
          <motion.button
            key={habit.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => toggleHabit(habit.id, today)}
            className={`group flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all ${
              isCompleted
                ? "border-cyan-500/30 bg-cyan-500/10"
                : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
            }`}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                isCompleted
                  ? "bg-cyan-500 text-white"
                  : "bg-white/10 text-white/50 group-hover:bg-white/20"
              }`}
            >
              <AnimatePresence mode="wait">
                {isCompleted ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Check className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="circle"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Circle className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex-1">
              <h4
                className={`font-medium ${
                  isCompleted ? "text-cyan-400" : "text-white"
                }`}
              >
                {habit.title}
              </h4>
              <p className="text-sm text-white/50">
                {habit.streak} day streak
              </p>
            </div>

            <div className="text-right">
              <span
                className={`text-xs font-medium uppercase tracking-wider ${
                  isCompleted ? "text-cyan-400" : "text-white/40"
                }`}
              >
                {isCompleted ? "Done" : "Pending"}
              </span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
