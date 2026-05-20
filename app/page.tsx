"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dumbbell,
  Brain,
  BookOpen,
  Code2,
  Flame,
  Calendar,
  Trophy,
  Moon,
  Sunrise,
  Target,
  Check,
  X,
  Droplets,
  TrendingUp,
  Clock,
  Zap,
  Plus,
  Minus,
} from "lucide-react";
import { useDailyStore } from "@/store/useDailyStore";
import { useWorkoutStore } from "@/store/useWorkoutStore";

export default function HomePage() {
  const { stats } = useWorkoutStore();
  const {
    exercises,
    studyTasks,
    japaneseTasks,
    dailyTrackers,
    getExercisePercentage,
    getStudyPercentage,
    getJapanesePercentage,
    getOverallPercentage,
    completeExerciseSet,
    toggleStudyTask,
    toggleJapaneseTask,
    incrementTracker,
    decrementTracker,
  } = useDailyStore();

  // Local state for toggleable items
  const [routineChecks, setRoutineChecks] = useState<Record<string, boolean>>({});
  const [recoveryChecks, setRecoveryChecks] = useState<Record<string, boolean>>({});

  const toggleRoutine = (item: string) => {
    setRoutineChecks((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const toggleRecovery = (item: string) => {
    setRecoveryChecks((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const exercisePercent = getExercisePercentage();
  const studyPercent = getStudyPercentage();
  const japanesePercent = getJapanesePercentage();
  const overallPercent = getOverallPercentage();

  const statCards = [
    {
      title: "Exercise Progress",
      value: `${exercisePercent}%`,
      icon: Dumbbell,
      color: "from-pink-500 to-red-500",
    },
    {
      title: "Japanese Study",
      value: `${japanesePercent}%`,
      icon: BookOpen,
      color: "from-cyan-500 to-blue-500",
    },
    {
      title: "IT Skills",
      value: `${studyPercent}%`,
      icon: Code2,
      color: "from-purple-500 to-indigo-500",
    },
    {
      title: "Overall Progress",
      value: `${overallPercent}%`,
      icon: TrendingUp,
      color: "from-green-400 to-emerald-500",
    },
  ];

  const morningRoutine = [
    { text: "Wake Up 7:00 AM", icon: Sunrise, key: "wakeup" },
    { text: "Drink Water (2 glasses)", icon: Droplets, key: "water" },
    { text: "Japanese Practice", icon: BookOpen, key: "japanese" },
    { text: "Workout Session", icon: Dumbbell, key: "workout" },
  ];

  const recoveryItems = [
    { text: "Sleep 7+ Hours", key: "sleep" },
    { text: "Stretching Done", key: "stretch" },
    { text: "Hydration Goal", key: "hydration" },
    { text: "No Late Screen", key: "screen" },
  ];

  // Get top exercises for quick access
  const topExercises = exercises.slice(0, 4);
  const topStudyTasks = studyTasks.slice(0, 3);
  const topJapaneseTasks = japaneseTasks.slice(0, 3);

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#6d28d9,transparent_35%),radial-gradient(circle_at_bottom_left,#06b6d4,transparent_35%)] opacity-30" />
      <div className="absolute inset-0 backdrop-blur-3xl" />

      <div className="relative z-10 px-6 md:px-10 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10"
        >
          <div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              2026
            </h1>
            <p className="text-gray-300 mt-3 text-lg">
              Your Personal Life Operating System
            </p>
          </div>
          <div className="mt-6 md:mt-0 flex items-center gap-4">
            {/* Overall Progress Circle */}
            <div className="relative h-20 w-20">
              <svg className="h-20 w-20 -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="6"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="url(#mainGradient)"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${overallPercent * 2.13} 213`}
                />
                <defs>
                  <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black">{overallPercent}%</span>
                <span className="text-[10px] text-gray-400">Today</span>
              </div>
            </div>
            <div className="bg-white/10 border border-white/10 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-[0_0_25px_rgba(0,255,255,0.15)]">
              <div className="flex items-center gap-3">
                <Calendar className="text-cyan-400" />
                <span>
                  {new Date().toLocaleDateString("en-US", { weekday: "long" })} • Mission Active
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Daily Trackers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8"
        >
          {dailyTrackers.map((tracker, i) => {
            const percent = Math.min((tracker.completed / tracker.target) * 100, 100);
            return (
              <div
                key={tracker.id}
                className="bg-white/10 border border-white/10 rounded-xl p-3 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">{tracker.name}</span>
                  <span className={`text-xs font-bold ${percent >= 100 ? "text-green-400" : ""}`}>
                    {Math.round(percent)}%
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => decrementTracker(tracker.id)}
                    className="p-1 rounded bg-white/10 hover:bg-white/20 transition"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="flex-1 text-center text-sm font-bold">
                    {tracker.completed}/{tracker.target}
                  </span>
                  <button
                    onClick={() => incrementTracker(tracker.id)}
                    className="p-1 rounded bg-white/10 hover:bg-white/20 transition"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full transition-all ${
                      percent >= 100 ? "bg-green-500" : "bg-gradient-to-r from-cyan-500 to-purple-500"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Stats */}
        <section className="grid md:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="bg-white/10 border border-white/10 backdrop-blur-2xl rounded-3xl p-6 relative overflow-hidden group"
            >
              <div
                className={`absolute inset-0 opacity-20 bg-gradient-to-br ${stat.color}`}
              />
              <div className="relative z-10">
                <div className="flex justify-between items-center">
                  <stat.icon className="w-8 h-8 text-white" />
                  <div className={`w-3 h-3 rounded-full ${parseInt(stat.value) >= 50 ? "bg-green-400" : "bg-cyan-400"} animate-pulse`} />
                </div>
                <h3 className="mt-6 text-gray-300">{stat.title}</h3>
                <p className="text-3xl font-black mt-2">{stat.value}</p>
                <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all`}
                    style={{ width: stat.value }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Exercise Tracking */}
            <GlassCard>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <Dumbbell className="text-pink-400" />
                  <h2 className="text-2xl font-bold">Exercise Tracker</h2>
                </div>
                <span className={`text-2xl font-bold ${exercisePercent >= 100 ? "text-green-400" : ""}`}>
                  {exercisePercent}%
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {topExercises.map((exercise) => {
                  const totalReps = exercise.sets * exercise.repsPerSet;
                  const completedReps = exercise.completedReps.reduce((a, b) => a + b, 0);
                  const percent = Math.min((completedReps / totalReps) * 100, 100);
                  const isComplete = exercise.completedSets >= exercise.sets;
                  return (
                    <div
                      key={exercise.id}
                      className={`border rounded-xl p-4 ${
                        isComplete
                          ? "bg-green-500/10 border-green-500/30"
                          : "bg-white/5 border-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{exercise.name}</span>
                        {isComplete && (
                          <div className="p-1 rounded-full bg-green-500">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="flex-1 text-center font-bold">
                          {exercise.completedSets}/{exercise.sets} sets
                        </span>
                      </div>
                      <div className="flex gap-1 mb-2">
                        {exercise.completedReps.map((reps, i) => (
                          <button
                            key={i}
                            onClick={() => completeExerciseSet(exercise.id, i)}
                            className={`flex-1 py-1 rounded text-xs transition ${
                              reps >= exercise.repsPerSet
                                ? "bg-green-500 text-white"
                                : "bg-white/10 hover:bg-white/20"
                            }`}
                          >
                            {reps}/{exercise.repsPerSet}
                          </button>
                        ))}
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isComplete ? "bg-green-500" : "bg-gradient-to-r from-pink-500 to-red-500"}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>{exercise.sets - exercise.completedSets} sets remaining</span>
                        <span>{Math.round(percent)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            {/* IT Skills Quick Access */}
            <GlassCard>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <Code2 className="text-purple-400" />
                  <h2 className="text-2xl font-bold">IT Study Tasks</h2>
                </div>
                <span className={`text-2xl font-bold ${studyPercent >= 100 ? "text-green-400" : ""}`}>
                  {studyPercent}%
                </span>
              </div>
              <div className="space-y-3">
                {topStudyTasks.map((task) => {
                  const percent = Math.min((task.completedMinutes / task.targetMinutes) * 100, 100);
                  return (
                    <button
                      key={task.id}
                      onClick={() => toggleStudyTask(task.id)}
                      className={`w-full flex items-center gap-4 border rounded-xl p-4 transition-all ${
                        task.completed
                          ? "bg-green-500/10 border-green-500/30"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                          task.completed ? "bg-green-500" : "border-2 border-purple-400"
                        }`}
                      >
                        {task.completed ? (
                          <Check className="h-4 w-4 text-white" />
                        ) : (
                          <Code2 className="h-4 w-4 text-purple-400" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <span className={task.completed ? "text-gray-400 line-through" : ""}>
                            {task.name}
                          </span>
                          <span className="text-xs px-2 py-1 rounded bg-white/10 uppercase">
                            {task.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${task.completed ? "bg-green-500" : "bg-purple-500"}`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400">{task.targetMinutes} min</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </GlassCard>

            {/* Japanese Quick Access */}
            <GlassCard>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <BookOpen className="text-cyan-400" />
                  <h2 className="text-2xl font-bold">Japanese Tasks</h2>
                </div>
                <span className={`text-2xl font-bold ${japanesePercent >= 100 ? "text-green-400" : ""}`}>
                  {japanesePercent}%
                </span>
              </div>
              <div className="space-y-3">
                {topJapaneseTasks.map((task) => {
                  const percent = Math.min((task.completedMinutes / task.targetMinutes) * 100, 100);
                  return (
                    <button
                      key={task.id}
                      onClick={() => toggleJapaneseTask(task.id)}
                      className={`w-full flex items-center gap-4 border rounded-xl p-4 transition-all ${
                        task.completed
                          ? "bg-green-500/10 border-green-500/30"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                          task.completed ? "bg-green-500" : "border-2 border-cyan-400"
                        }`}
                      >
                        {task.completed ? (
                          <Check className="h-4 w-4 text-white" />
                        ) : (
                          <BookOpen className="h-4 w-4 text-cyan-400" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <span className={task.completed ? "text-gray-400 line-through" : ""}>
                            {task.name}
                          </span>
                          <span className="text-xs px-2 py-1 rounded bg-white/10 uppercase">
                            {task.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${task.completed ? "bg-green-500" : "bg-cyan-500"}`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400">{task.targetMinutes} min</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Daily Report */}
            <GlassCard>
              <div className="flex items-center gap-3 mb-5">
                <Target className="text-yellow-400" />
                <h2 className="text-xl font-bold">Daily Report</h2>
              </div>
              <div className="space-y-4">
                <ReportItem label="Exercise" value={exercisePercent} color="from-pink-500 to-red-500" />
                <ReportItem label="IT Study" value={studyPercent} color="from-purple-500 to-indigo-500" />
                <ReportItem label="Japanese" value={japanesePercent} color="from-cyan-500 to-blue-500" />
                <div className="pt-4 border-t border-white/10">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">Overall Score</span>
                    <span className={`font-bold ${overallPercent >= 80 ? "text-green-400" : overallPercent >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                      {overallPercent}%
                    </span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full"
                      style={{ width: `${overallPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center gap-3 mb-5">
                <Sunrise className="text-yellow-400" />
                <h2 className="text-xl font-bold">Morning Routine</h2>
              </div>
              {morningRoutine.map((item) => (
                <ToggleableRoutineItem
                  key={item.key}
                  text={item.text}
                  icon={item.icon}
                  isChecked={routineChecks[item.key]}
                  onToggle={() => toggleRoutine(item.key)}
                />
              ))}
            </GlassCard>

            <GlassCard>
              <div className="flex items-center gap-3 mb-5">
                <Moon className="text-indigo-400" />
                <h2 className="text-xl font-bold">Recovery</h2>
              </div>
              <div className="space-y-3">
                {recoveryItems.map((item) => (
                  <ToggleableRecoveryItem
                    key={item.key}
                    text={item.text}
                    isChecked={recoveryChecks[item.key]}
                    onToggle={() => toggleRecovery(item.key)}
                  />
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center gap-3 mb-5">
                <Trophy className="text-orange-400" />
                <h2 className="text-xl font-bold">Achievements</h2>
              </div>
              <Achievement text={`${stats.currentStreak} Day Workout Streak`} />
              <Achievement text="N2 Japanese Holder" />
              <Achievement text="First Coding Project" />
              <Achievement text="Discipline Rising" />
            </GlassCard>
          </div>
        </div>
      </div>
    </main>
  );
}

/* Components */
function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-2xl shadow-[0_0_30px_rgba(0,255,255,0.08)]">
      {children}
    </div>
  );
}

function ReportItem({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between mb-1 text-sm">
        <span>{label}</span>
        <span className={value >= 100 ? "text-green-400 font-bold" : ""}>{value}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function ToggleableRoutineItem({
  text,
  icon: Icon,
  isChecked,
  onToggle,
}: {
  text: string;
  icon: React.ComponentType<{ className?: string }>;
  isChecked?: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center gap-3 border rounded-xl px-4 py-3 mb-3 transition-all ${
        isChecked
          ? "bg-green-500/20 border-green-500/30"
          : "bg-white/5 border-white/10 hover:bg-white/10"
      }`}
    >
      <div
        className={`p-2 rounded-lg ${isChecked ? "bg-green-500" : "bg-yellow-500/20"}`}
      >
        <Icon className={`h-4 w-4 ${isChecked ? "text-white" : "text-yellow-400"}`} />
      </div>
      <span className={`flex-1 text-left ${isChecked ? "text-gray-400 line-through" : ""}`}>
        {text}
      </span>
      <div
        className={`h-6 w-6 rounded-full flex items-center justify-center ${
          isChecked ? "bg-green-500" : "border-2 border-white/30"
        }`}
      >
        {isChecked ? (
          <Check className="h-4 w-4 text-white" />
        ) : (
          <X className="h-3 w-3 text-white/30" />
        )}
      </div>
    </button>
  );
}

function ToggleableRecoveryItem({
  text,
  isChecked,
  onToggle,
}: {
  text: string;
  isChecked?: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between border rounded-xl px-4 py-3 transition-all ${
        isChecked
          ? "bg-green-500/20 border-green-500/30"
          : "bg-white/5 border-white/10 hover:bg-white/10"
      }`}
    >
      <span className={isChecked ? "text-gray-400 line-through" : ""}>{text}</span>
      <div
        className={`h-6 w-6 rounded-full flex items-center justify-center ${
          isChecked ? "bg-green-500" : "border-2 border-white/30"
        }`}
      >
        {isChecked ? (
          <Check className="h-4 w-4 text-white" />
        ) : (
          <X className="h-3 w-3 text-white/30" />
        )}
      </div>
    </button>
  );
}

function Achievement({ text }: { text: string }) {
  return (
    <div className="bg-gradient-to-r from-orange-500/20 to-pink-500/20 border border-orange-400/20 rounded-xl px-4 py-3 mb-3">
      {text}
    </div>
  );
}
