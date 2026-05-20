"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dumbbell,
  Flame,
  Heart,
  TrendingUp,
  Calendar,
  Plus,
  Timer,
  Trophy,
  Target,
  Check,
  Minus,
  Droplets,
  Moon,
  Zap,
  Smile,
  X,
  Footprints,
  Clock,
} from "lucide-react";
import { useDailyStore } from "@/store/useDailyStore";
import { useWorkoutStore } from "@/store/useWorkoutStore";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Droplets,
  Moon,
  Footprints,
  Flame,
  Smile,
  Zap,
};

export default function HealthPage() {
  const { stats } = useWorkoutStore();
  const {
    exercises,
    dailyTrackers,
    completeExerciseSet,
    updateExerciseSet,
    addExercise,
    removeExercise,
    incrementTracker,
    decrementTracker,
    updateDailyTracker,
    getExercisePercentage,
  } = useDailyStore();

  const [showAddExercise, setShowAddExercise] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: "",
    sets: 3,
    repsPerSet: 15,
    unit: "reps",
    category: "push" as const,
  });

  const exercisePercent = getExercisePercentage();

  const handleAddExercise = () => {
    if (newExercise.name.trim()) {
      addExercise({
        name: newExercise.name,
        sets: newExercise.sets,
        repsPerSet: newExercise.repsPerSet,
        unit: newExercise.unit,
        category: newExercise.category,
      });
      setNewExercise({ name: "", sets: 3, repsPerSet: 15, unit: "reps", category: "push" });
      setShowAddExercise(false);
    }
  };

  const categories = ["push", "pull", "legs", "core", "cardio"] as const;
  const categoryColors = {
    push: "from-pink-500 to-red-500",
    pull: "from-cyan-500 to-blue-500",
    legs: "from-purple-500 to-indigo-500",
    core: "from-orange-500 to-yellow-500",
    cardio: "from-green-500 to-emerald-500",
  };

  const categoryLabels = {
    push: "Push Day",
    pull: "Pull Day",
    legs: "Leg Day",
    core: "Core",
    cardio: "Cardio",
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#ec4899,transparent_40%),radial-gradient(circle_at_bottom_left,#f97316,transparent_40%)] opacity-20" />
      <div className="absolute inset-0 backdrop-blur-3xl" />

      <div className="relative z-10 px-6 md:px-10 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-red-500">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black">Health & Fitness</h1>
                <p className="text-gray-400">Track your physical progress</p>
              </div>
            </div>
            {/* Overall Progress Circle */}
            <div className="relative h-24 w-24">
              <svg className="h-24 w-24 -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${exercisePercent * 2.51} 251`}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black">{exercisePercent}%</span>
                <span className="text-xs text-gray-400">Complete</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Daily Life Trackers */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {dailyTrackers.map((tracker, i) => {
            const Icon = iconMap[tracker.icon] || Zap;
            const percent = Math.min((tracker.completed / tracker.target) * 100, 100);
            return (
              <motion.div
                key={tracker.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className="h-5 w-5 text-cyan-400" />
                  <span className={`text-xs font-bold ${percent >= 100 ? "text-green-400" : "text-gray-400"}`}>
                    {Math.round(percent)}%
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-1">{tracker.name}</p>
                <div className="flex items-center gap-2 mb-2">
                  <button
                    onClick={() => decrementTracker(tracker.id)}
                    className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="flex-1 text-center font-bold">
                    {tracker.completed}/{tracker.target}
                  </span>
                  <button
                    onClick={() => incrementTracker(tracker.id)}
                    className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      percent >= 100 ? "bg-green-500" : "bg-gradient-to-r from-cyan-500 to-blue-500"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Current Streak", value: `${stats.currentStreak} days`, icon: Flame, color: "from-orange-500 to-red-500" },
            { label: "Exercise Done", value: `${exercisePercent}%`, icon: Target, color: "from-cyan-500 to-blue-500" },
            { label: "This Month", value: `${stats.thisMonthWorkouts}`, icon: TrendingUp, color: "from-purple-500 to-pink-500" },
            { label: "Total Workouts", value: stats.totalWorkouts.toString(), icon: Trophy, color: "from-green-500 to-emerald-500" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/10 border border-white/10 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10`} />
              <div className="relative z-10">
                <stat.icon className="h-6 w-6 text-white/60 mb-3" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Exercise Sections by Category */}
        <div className="space-y-6">
          {categories.map((category) => {
            const categoryExercises = exercises.filter((e) => e.category === category);
            if (categoryExercises.length === 0) return null;
            
            const categoryPercent = categoryExercises.length > 0
              ? Math.round(
                  (categoryExercises.reduce((acc, e) => acc + Math.min(e.completed / e.target, 1), 0) /
                    categoryExercises.length) *
                    100
                )
              : 0;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${categoryColors[category]}`}>
                      <Dumbbell className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{categoryLabels[category]}</h2>
                      <p className="text-sm text-gray-400">
                        {categoryExercises.filter((e) => e.completed >= e.target).length}/
                        {categoryExercises.length} completed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-bold ${categoryPercent >= 100 ? "text-green-400" : ""}`}>
                      {categoryPercent}%
                    </span>
                    {categoryPercent >= 100 && (
                      <div className="p-2 rounded-full bg-green-500">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {categoryExercises.map((exercise) => {
                    const totalReps = exercise.sets * exercise.repsPerSet;
                    const completedReps = exercise.completedReps.reduce((a, b) => a + b, 0);
                    const percent = Math.min((completedReps / totalReps) * 100, 100);
                    const isComplete = exercise.completedSets >= exercise.sets;

                    return (
                      <div
                        key={exercise.id}
                        className={`border rounded-2xl p-4 transition-all ${
                          isComplete
                            ? "bg-green-500/10 border-green-500/30"
                            : "bg-white/5 border-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{exercise.name}</span>
                            {isComplete && (
                              <div className="p-1 rounded-full bg-green-500">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => removeExercise(exercise.id)}
                            className="p-1 rounded-lg hover:bg-white/10 transition text-gray-500 hover:text-red-400"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mb-3">
                          <div className="text-center mb-2">
                            <span className="text-2xl font-bold">{exercise.completedSets}</span>
                            <span className="text-gray-400">/{exercise.sets} sets</span>
                          </div>
                          <div className="flex gap-1">
                            {exercise.completedReps.map((reps, i) => (
                              <button
                                key={i}
                                onClick={() => completeExerciseSet(exercise.id, i)}
                                className={`flex-1 py-2 rounded text-sm transition ${
                                  reps >= exercise.repsPerSet
                                    ? "bg-green-500 text-white"
                                    : "bg-white/10 hover:bg-white/20"
                                }`}
                              >
                                {reps}/{exercise.repsPerSet}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percent}%` }}
                              className={`h-full rounded-full ${
                                isComplete
                                  ? "bg-green-500"
                                  : `bg-gradient-to-r ${categoryColors[exercise.category]}`
                              }`}
                            />
                          </div>
                          <span className={`text-sm font-bold ${isComplete ? "text-green-400" : ""}`}>
                            {Math.round(percent)}%
                          </span>
                        </div>

                        <div className="mt-2 flex justify-between text-xs text-gray-400">
                          <span>Remaining: {exercise.sets - exercise.completedSets} sets</span>
                          <span>{isComplete ? "COMPLETED" : `${exercise.sets - exercise.completedSets} sets to go`}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Add Exercise Modal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Add New Exercise</h2>
            <button
              onClick={() => setShowAddExercise(!showAddExercise)}
              className="p-2 rounded-xl bg-gradient-to-r from-pink-500 to-red-500 hover:opacity-90 transition"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          {showAddExercise && (
            <div className="grid md:grid-cols-5 gap-4">
              <input
                type="text"
                placeholder="Exercise name..."
                value={newExercise.name}
                onChange={(e) => setNewExercise((p) => ({ ...p, name: e.target.value }))}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-400 outline-none"
              />
              <input
                type="number"
                placeholder="Sets"
                value={newExercise.sets}
                onChange={(e) => setNewExercise((p) => ({ ...p, sets: parseInt(e.target.value) || 3 }))}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-400 outline-none"
              />
              <input
                type="number"
                placeholder="Reps per set"
                value={newExercise.repsPerSet}
                onChange={(e) => setNewExercise((p) => ({ ...p, repsPerSet: parseInt(e.target.value) || 10 }))}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-400 outline-none"
              />
              <select
                value={newExercise.category}
                onChange={(e) =>
                  setNewExercise((p) => ({ ...p, category: e.target.value as typeof newExercise.category }))
                }
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-400 outline-none"
              >
                <option value="push">Push</option>
                <option value="pull">Pull</option>
                <option value="legs">Legs</option>
                <option value="core">Core</option>
                <option value="cardio">Cardio</option>
              </select>
              <button
                onClick={handleAddExercise}
                className="bg-gradient-to-r from-pink-500 to-red-500 rounded-xl px-4 py-3 font-medium hover:opacity-90 transition"
              >
                Add Exercise
              </button>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl p-5 font-medium hover:opacity-90 transition"
          >
            <Timer className="h-6 w-6" />
            <div className="text-left">
              <p className="font-bold">Start Workout Timer</p>
              <p className="text-sm opacity-80">Track your session duration</p>
            </div>
          </motion.button>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl p-5 font-medium hover:bg-white/20 transition"
          >
            <Calendar className="h-6 w-6" />
            <div className="text-left">
              <p className="font-bold">View Workout History</p>
              <p className="text-sm text-gray-400">Check past sessions</p>
            </div>
          </motion.button>
        </div>
      </div>
    </main>
  );
}
