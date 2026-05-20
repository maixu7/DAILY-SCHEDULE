"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Sun,
  Moon,
  Coffee,
  Dumbbell,
  BookOpen,
  Brain,
  Check,
  X,
  Clock,
  Sparkles,
  Droplets,
} from "lucide-react";
import { useHabitStore } from "@/store/useHabitStore";

export default function RoutinesPage() {
  const { habits, toggleHabit } = useHabitStore();
  const today = new Date().toISOString().split("T")[0];

  const [activeTab, setActiveTab] = useState<"morning" | "evening">("morning");

  // Toggleable routine states
  const [morningChecks, setMorningChecks] = useState<Record<string, boolean>>({
    "Wake Up": true,
    "Drink Water": true,
    "Cold Shower": true,
    "Meditation (15 min)": true,
  });
  const [eveningChecks, setEveningChecks] = useState<Record<string, boolean>>({
    "Review Daily Goals": true,
    "Light Exercise/Walk": true,
  });

  const toggleMorning = (task: string) => {
    setMorningChecks((prev) => ({ ...prev, [task]: !prev[task] }));
  };

  const toggleEvening = (task: string) => {
    setEveningChecks((prev) => ({ ...prev, [task]: !prev[task] }));
  };

  const morningRoutine = [
    { time: "5:30", task: "Wake Up", icon: Sun },
    { time: "5:35", task: "Drink Water", icon: Droplets },
    { time: "5:45", task: "Cold Shower", icon: Sparkles },
    { time: "6:00", task: "Meditation (15 min)", icon: Brain },
    { time: "6:15", task: "Journal & Planning", icon: BookOpen },
    { time: "6:30", task: "Workout Session", icon: Dumbbell },
    { time: "8:00", task: "Japanese Study", icon: BookOpen },
    { time: "9:00", task: "IT Practice", icon: Brain },
  ];

  const eveningRoutine = [
    { time: "18:00", task: "Review Daily Goals", icon: Check },
    { time: "18:30", task: "Light Exercise/Walk", icon: Dumbbell },
    { time: "19:00", task: "Dinner", icon: Coffee },
    { time: "20:00", task: "Reading/Learning", icon: BookOpen },
    { time: "21:00", task: "Tomorrow Planning", icon: Calendar },
    { time: "21:30", task: "Digital Detox", icon: Moon },
    { time: "22:00", task: "Sleep Preparation", icon: Moon },
    { time: "22:30", task: "Sleep", icon: Moon },
  ];

  const weeklyHabits = [
    { day: "Mon", habits: 4, completed: 4 },
    { day: "Tue", habits: 4, completed: 4 },
    { day: "Wed", habits: 4, completed: 3 },
    { day: "Thu", habits: 4, completed: 4 },
    { day: "Fri", habits: 4, completed: 2 },
    { day: "Sat", habits: 4, completed: 0 },
    { day: "Sun", habits: 4, completed: 0 },
  ];

  const currentRoutine = activeTab === "morning" ? morningRoutine : eveningRoutine;
  const currentChecks = activeTab === "morning" ? morningChecks : eveningChecks;
  const toggleCurrent = activeTab === "morning" ? toggleMorning : toggleEvening;

  const completedCount = Object.values(currentChecks).filter(Boolean).length;
  const totalCount = currentRoutine.length;

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#eab308,transparent_40%),radial-gradient(circle_at_bottom_left,#6366f1,transparent_40%)] opacity-20" />
      <div className="absolute inset-0 backdrop-blur-3xl" />

      <div className="relative z-10 px-6 md:px-10 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black">Daily Routines</h1>
              <p className="text-gray-400">Build habits, build your future</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Current Streak", value: "30 days", icon: Sparkles },
            { label: "Habits Today", value: `${completedCount}/${totalCount}`, icon: Check },
            { label: "Best Streak", value: "45 days", icon: Calendar },
            { label: "Completion Rate", value: `${Math.round((completedCount / totalCount) * 100)}%`, icon: Brain },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/10 border border-white/10 rounded-2xl p-5 backdrop-blur-xl"
            >
              <stat.icon className="h-6 w-6 text-yellow-400 mb-3" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Switcher */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
            >
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setActiveTab("morning")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                    activeTab === "morning"
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  <Sun className="h-5 w-5" />
                  Morning Routine
                </button>
                <button
                  onClick={() => setActiveTab("evening")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                    activeTab === "evening"
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  <Moon className="h-5 w-5" />
                  Evening Routine
                </button>
              </div>

              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-gray-400">Today&apos;s Progress</span>
                  <span className="text-yellow-400">{completedCount}/{totalCount} completed</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedCount / totalCount) * 100}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-full rounded-full ${
                      activeTab === "morning"
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                        : "bg-gradient-to-r from-indigo-500 to-purple-500"
                    }`}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-3"
                >
                  {currentRoutine.map((item, i) => {
                    const isCompleted = currentChecks[item.task];
                    return (
                      <motion.button
                        key={item.task}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => toggleCurrent(item.task)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                          isCompleted
                            ? "bg-green-500/20 border-green-500/30"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <span className="text-sm text-gray-400 w-14">{item.time}</span>
                        <div
                          className={`p-2 rounded-lg ${
                            isCompleted
                              ? "bg-green-500"
                              : activeTab === "morning"
                              ? "bg-yellow-500/20"
                              : "bg-indigo-500/20"
                          }`}
                        >
                          <item.icon
                            className={`h-5 w-5 ${
                              isCompleted
                                ? "text-white"
                                : activeTab === "morning"
                                ? "text-yellow-400"
                                : "text-indigo-400"
                            }`}
                          />
                        </div>
                        <span
                          className={`flex-1 text-left font-medium ${
                            isCompleted ? "text-gray-400 line-through" : "text-white"
                          }`}
                        >
                          {item.task}
                        </span>
                        <div
                          className={`h-7 w-7 rounded-full flex items-center justify-center ${
                            isCompleted
                              ? "bg-green-500"
                              : "border-2 border-white/30"
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="h-4 w-4 text-white" />
                          ) : (
                            <X className="h-3 w-3 text-white/30" />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Weekly Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
            >
              <h2 className="text-xl font-bold mb-6">Weekly Habit Completion</h2>
              <div className="flex gap-2">
                {weeklyHabits.map((day, i) => {
                  const percentage = (day.completed / day.habits) * 100;
                  const isToday = i === new Date().getDay() - 1 || (new Date().getDay() === 0 && i === 6);
                  return (
                    <div key={day.day} className="flex-1 text-center">
                      <div
                        className={`h-32 rounded-xl mb-2 relative overflow-hidden ${
                          isToday ? "ring-2 ring-yellow-400" : ""
                        }`}
                        style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                      >
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${percentage}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className={`absolute bottom-0 left-0 right-0 rounded-xl ${
                            percentage === 100
                              ? "bg-gradient-to-t from-green-500 to-green-400"
                              : percentage > 50
                              ? "bg-gradient-to-t from-yellow-500 to-yellow-400"
                              : "bg-gradient-to-t from-red-500 to-red-400"
                          }`}
                        />
                      </div>
                      <span className={`text-sm ${isToday ? "text-yellow-400 font-bold" : "text-gray-400"}`}>
                        {day.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Active Habits */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
            >
              <h2 className="text-xl font-bold mb-4">Active Habits</h2>
              <div className="space-y-3">
                {habits.map((habit) => {
                  const isCompleted = habit.completedDates.includes(today);
                  return (
                    <button
                      key={habit.id}
                      onClick={() => toggleHabit(habit.id, today)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${
                        isCompleted
                          ? "bg-green-500/20 border-green-500/30"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div
                        className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                          isCompleted ? "bg-green-500" : "bg-white/10"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="h-5 w-5 text-white" />
                        ) : (
                          <X className="h-4 w-4 text-white/30" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`font-medium ${isCompleted ? "text-gray-400 line-through" : ""}`}>
                          {habit.title}
                        </p>
                        <p className="text-xs text-gray-500">{habit.streak} day streak</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Time Blocks */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock className="text-purple-400" />
                Time Blocks
              </h2>
              <div className="space-y-3">
                {[
                  { block: "Deep Work", time: "9:00 - 12:00", color: "from-cyan-500 to-blue-500" },
                  { block: "Learning", time: "14:00 - 16:00", color: "from-purple-500 to-pink-500" },
                  { block: "Exercise", time: "6:30 - 8:00", color: "from-orange-500 to-red-500" },
                  { block: "Rest", time: "22:00 - 5:30", color: "from-indigo-500 to-purple-500" },
                ].map((block) => (
                  <div key={block.block} className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-1 h-10 rounded-full bg-gradient-to-b ${block.color}`} />
                      <div>
                        <p className="font-medium">{block.block}</p>
                        <p className="text-sm text-gray-400">{block.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Motivation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/20 rounded-3xl p-6 backdrop-blur-xl"
            >
              <Sparkles className="h-8 w-8 text-yellow-400 mb-4" />
              <p className="text-lg font-medium mb-2">
                {"\"Discipline is the bridge between goals and accomplishment.\""}
              </p>
              <p className="text-sm text-gray-400">- Jim Rohn</p>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
