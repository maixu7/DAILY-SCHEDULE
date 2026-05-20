import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Workout {
  id: string;
  date: string;
  type: "strength" | "cardio" | "flexibility" | "mixed";
  duration: number;
  exercises: Exercise[];
  notes?: string;
}

export interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
}

interface WorkoutStats {
  totalWorkouts: number;
  currentStreak: number;
  longestStreak: number;
  thisWeekWorkouts: number;
  thisMonthWorkouts: number;
}

interface WorkoutState {
  workouts: Workout[];
  stats: WorkoutStats;
  addWorkout: (workout: Omit<Workout, "id">) => void;
  removeWorkout: (id: string) => void;
  getWorkoutsByDateRange: (start: string, end: string) => Workout[];
  updateStats: () => void;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      workouts: [
        {
          id: "1",
          date: new Date().toISOString().split("T")[0],
          type: "strength",
          duration: 60,
          exercises: [
            { name: "Bench Press", sets: 4, reps: 8, weight: 80 },
            { name: "Squats", sets: 4, reps: 10, weight: 100 },
            { name: "Deadlift", sets: 3, reps: 6, weight: 120 },
          ],
        },
      ],
      stats: {
        totalWorkouts: 156,
        currentStreak: 18,
        longestStreak: 32,
        thisWeekWorkouts: 5,
        thisMonthWorkouts: 18,
      },
      addWorkout: (workout) =>
        set((state) => ({
          workouts: [
            ...state.workouts,
            { ...workout, id: Date.now().toString() },
          ],
        })),
      removeWorkout: (id) =>
        set((state) => ({
          workouts: state.workouts.filter((w) => w.id !== id),
        })),
      getWorkoutsByDateRange: (start, end) =>
        get().workouts.filter((w) => w.date >= start && w.date <= end),
      updateStats: () => {
        const workouts = get().workouts;
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

        set({
          stats: {
            totalWorkouts: workouts.length,
            currentStreak: get().stats.currentStreak,
            longestStreak: get().stats.longestStreak,
            thisWeekWorkouts: workouts.filter(
              (w) => new Date(w.date) >= weekStart
            ).length,
            thisMonthWorkouts: workouts.filter(
              (w) => new Date(w.date) >= monthStart
            ).length,
          },
        });
      },
    }),
    { name: "workout-storage" }
  )
);
