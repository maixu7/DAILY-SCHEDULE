"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Plus,
  Timer,
  X,
  Check,
  Minus,
} from "lucide-react";

import { useDailyStore } from "@/store/useDailyStore";

export default function HealthPage() {
  const {
    exercises,
    addExercise,
    removeExercise,
    toggleExerciseSet,
    getExercisePercentage,
    trackers,
    incrementTracker,
    decrementTracker,
    startTimer,
    stopTimer,
    timerSeconds,
    isTimerRunning,
    showHistory,
    toggleHistory,
    history,
  } = useDailyStore();

  const [showAdd, setShowAdd] = useState(false);

  const [form, setForm] = useState({
    name: "",
    sets: 3,
    reps: 10,
    category: "push" as const,
  });

  // ADD EXERCISE
  const handleAdd = () => {
    if (!form.name.trim()) return;

    addExercise(form.name, form.sets, form.reps);

    setForm({ name: "", sets: 3, reps: 10, category: "push" });
    setShowAdd(false);
  };

  return (
    <main className="min-h-screen bg-black text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Heart /> Health & Fitness
        </h1>

        <button
          onClick={() => (isTimerRunning ? stopTimer() : startTimer())}
          className="bg-red-500 px-4 py-2 rounded-xl"
        >
          <Timer className="inline mr-2" />
          {isTimerRunning ? "Stop" : "Start"} ({timerSeconds}s)
        </button>
      </div>

      {/* TRACKERS */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {trackers.map((t) => (
          <div key={t.id} className="bg-white/10 p-3 rounded-xl">
            <p className="text-sm">{t.label}</p>
            <div className="flex items-center justify-between mt-2">
              <button onClick={() => decrementTracker(t.id)}>
                <Minus />
              </button>
              <span>
                {t.value}/{t.goal}
              </span>
              <button onClick={() => incrementTracker(t.id)}>
                <Plus />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EXERCISES */}
      <div className="space-y-4">
        {exercises.map((ex) => {
          const totalSets = ex.sets.length;
          const completedSets = ex.sets.filter((s) => s.completed).length;

          const percent =
            totalSets === 0
              ? 0
              : Math.round((completedSets / totalSets) * 100);

          return (
            <div key={ex.id} className="bg-white/10 p-4 rounded-xl">

              {/* HEADER */}
              <div className="flex justify-between">
                <h2 className="font-bold">{ex.name}</h2>

                <button onClick={() => removeExercise(ex.id)}>
                  <X />
                </button>
              </div>

              {/* SETS */}
              <div className="flex gap-2 mt-3">
                {ex.sets.map((set, i) => (
                  <button
                    key={i}
                    onClick={() => toggleExerciseSet(ex.id, i)}
                    className={`flex-1 p-2 rounded ${
                      set.completed ? "bg-green-500" : "bg-white/10"
                    }`}
                  >
                    {set.reps}
                  </button>
                ))}
              </div>

              {/* PROGRESS */}
              <div className="mt-3 h-2 bg-white/10 rounded-full">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <p className="text-sm mt-1">
                {completedSets}/{totalSets} sets ({percent}%)
              </p>
            </div>
          );
        })}
      </div>

      {/* ADD EXERCISE */}
      <div className="mt-6">
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-blue-500 px-4 py-2 rounded-xl"
        >
          <Plus className="inline mr-2" />
          Add Exercise
        </button>

        {showAdd && (
          <div className="mt-3 space-y-2">
            <input
              className="w-full p-2 bg-white/10 rounded"
              placeholder="Exercise name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              type="number"
              className="w-full p-2 bg-white/10 rounded"
              placeholder="Sets"
              value={form.sets}
              onChange={(e) =>
                setForm({ ...form, sets: Number(e.target.value) })
              }
            />

            <input
              type="number"
              className="w-full p-2 bg-white/10 rounded"
              placeholder="Reps"
              value={form.reps}
              onChange={(e) =>
                setForm({ ...form, reps: Number(e.target.value) })
              }
            />

            <button
              onClick={handleAdd}
              className="bg-green-500 px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* HISTORY */}
      <div className="mt-6">
        <button
          onClick={toggleHistory}
          className="bg-gray-700 px-4 py-2 rounded"
        >
          View History
        </button>

        {showHistory && (
          <div className="mt-3 bg-white/10 p-4 rounded-xl">
            <h2 className="font-bold mb-2">History</h2>

            {history.length === 0 ? (
              <p className="text-gray-400">No workouts yet</p>
            ) : (
              history.map((h, i) => (
                <div key={i} className="text-sm mb-2">
                  {h.date} — {h.duration}s — {h.exercisesDone} exercises
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}