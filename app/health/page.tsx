"use client";
import { useState, useEffect } from "react";
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
 Zap,
 X,
} from "lucide-react";
import { useDailyStore } from "@/store/useDailyStore";
import { useWorkoutStore } from "@/store/useWorkoutStore";
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
export default function HealthPage() {
 const { stats } = useWorkoutStore();
 const {
   exercises,
   dailyTrackers,
   addExercise,
   removeExercise,
   incrementTracker,
   decrementTracker,
   toggleExerciseSet, // ✅ NEW FIXED FUNCTION
 } = useDailyStore();
 const [showAddExercise, setShowAddExercise] = useState(false);
 const [historyOpen, setHistoryOpen] = useState(false);
 const [timerRunning, setTimerRunning] = useState(false);
 const [seconds, setSeconds] = useState(0);
 const [newExercise, setNewExercise] = useState({
   name: "",
   sets: 3,
   repsPerSet: 10,
   unit: "reps",
   category: "push" as const,
 });
 // ================= TIMER =================
 useEffect(() => {
   let interval: NodeJS.Timeout;
   if (timerRunning) {
     interval = setInterval(() => {
       setSeconds((s) => s + 1);
     }, 1000);
   }
   return () => clearInterval(interval);
 }, [timerRunning]);
 // ================= SAFE PERCENT =================
 const safePercent = (completed: number, total: number) => {
   if (!total || total <= 0) return 0;
   return Math.min(Math.round((completed / total) * 100), 100);
 };
 const exercisePercent = safePercent(
   exercises.reduce((acc, e) => acc + e.completedSets, 0),
   exercises.reduce((acc, e) => acc + e.sets, 0)
 );
 // ================= ADD EXERCISE =================
 const handleAddExercise = () => {
   if (!newExercise.name.trim()) return;
   addExercise({
     ...newExercise,
   });
   setNewExercise({
     name: "",
     sets: 3,
     repsPerSet: 10,
     unit: "reps",
     category: "push",
   });
   setShowAddExercise(false);
 };
 return (
<main className="min-h-screen bg-black text-white p-6">
     {/* HEADER */}
<div className="flex justify-between items-center mb-6">
<div>
<h1 className="text-3xl font-bold flex items-center gap-2">
<Heart /> Health & Fitness
</h1>
<p className="text-gray-400">Track your progress</p>
</div>
       {/* TIMER */}
<button
         onClick={() => setTimerRunning((p) => !p)}
         className="bg-red-500 px-4 py-2 rounded-xl"
>
<Timer /> {timerRunning ? "Stop" : "Start"}
<div className="text-sm">
           {Math.floor(seconds / 60)}:
           {String(seconds % 60).padStart(2, "0")}
</div>
</button>
</div>
     {/* EXERCISES */}
<div className="space-y-6">
       {exercises.map((ex) => {
         const total = ex.sets * ex.repsPerSet;
         const completed = ex.completedReps.reduce((a, b) => a + b, 0);
         const percent = safePercent(completed, total);
         const isComplete = ex.completedSets >= ex.sets;
         return (
<div
             key={ex.id}
             className="bg-white/10 p-4 rounded-xl border border-white/10"
>
<div className="flex justify-between">
<h2 className="font-bold">{ex.name}</h2>
<button onClick={() => removeExercise(ex.id)}>
<X />
</button>
</div>
<p className="text-sm text-gray-400">
               {ex.completedSets}/{ex.sets} sets
</p>
             {/* SETS */}
<div className="flex gap-2 mt-3">
               {ex.completedReps.map((rep, i) => (
<button
                   key={i}
                   onClick={() => toggleExerciseSet(ex.id, i)} // ✅ FIXED TOGGLE
                   className={`flex-1 p-2 rounded ${
                     rep >= ex.repsPerSet
                       ? "bg-green-500"
                       : "bg-white/10"
                   }`}
>
                   {rep}/{ex.repsPerSet}
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
<p className="text-sm mt-1">{percent}% complete</p>
</div>
         );
       })}
</div>
     {/* ADD EXERCISE */}
<div className="mt-8">
<button
         onClick={() => setShowAddExercise((p) => !p)}
         className="bg-blue-500 px-4 py-2 rounded-xl"
>
<Plus /> Add Exercise
</button>
       {showAddExercise && (
<div className="mt-4 space-y-2">
<input
             placeholder="Name"
             className="p-2 bg-white/10 rounded w-full"
             value={newExercise.name}
             onChange={(e) =>
               setNewExercise({ ...newExercise, name: e.target.value })
             }
           />
<button
             onClick={handleAddExercise}
             className="bg-green-500 px-4 py-2 rounded"
>
             Save
</button>
</div>
       )}
</div>
     {/* HISTORY */}
     {historyOpen && (
<div className="fixed inset-0 bg-black/70 flex items-center justify-center">
<div className="bg-gray-900 p-6 rounded-xl">
<h2 className="text-xl font-bold">Workout History</h2>
<p className="text-gray-400 mt-2">
             (No backend yet — we can add Supabase later)
</p>
<button
             onClick={() => setHistoryOpen(false)}
             className="mt-4 bg-red-500 px-4 py-2 rounded"
>
             Close
</button>
</div>
</div>
     )}
</main>
 );
}