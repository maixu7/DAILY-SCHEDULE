import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Habit {
  id: string;
  title: string;
  icon: string;
  category: "health" | "japanese" | "skills" | "routine";
  streak: number;
  completedDates: string[];
  targetDays: number[];
}

interface HabitState {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, "id" | "streak" | "completedDates">) => void;
  toggleHabit: (id: string, date: string) => void;
  removeHabit: (id: string) => void;
  getHabitsByCategory: (category: Habit["category"]) => Habit[];
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: [
        {
          id: "1",
          title: "Morning Workout",
          icon: "Dumbbell",
          category: "health",
          streak: 18,
          completedDates: [],
          targetDays: [1, 2, 3, 4, 5, 6, 0],
        },
        {
          id: "2",
          title: "Japanese Study",
          icon: "Languages",
          category: "japanese",
          streak: 45,
          completedDates: [],
          targetDays: [1, 2, 3, 4, 5, 6, 0],
        },
        {
          id: "3",
          title: "IT Practice",
          icon: "Code",
          category: "skills",
          streak: 12,
          completedDates: [],
          targetDays: [1, 2, 3, 4, 5],
        },
        {
          id: "4",
          title: "Evening Reflection",
          icon: "Brain",
          category: "routine",
          streak: 30,
          completedDates: [],
          targetDays: [1, 2, 3, 4, 5, 6, 0],
        },
      ],
      addHabit: (habit) =>
        set((state) => ({
          habits: [
            ...state.habits,
            {
              ...habit,
              id: Date.now().toString(),
              streak: 0,
              completedDates: [],
            },
          ],
        })),
      toggleHabit: (id, date) =>
        set((state) => ({
          habits: state.habits.map((habit) => {
            if (habit.id !== id) return habit;
            const isCompleted = habit.completedDates.includes(date);
            return {
              ...habit,
              completedDates: isCompleted
                ? habit.completedDates.filter((d) => d !== date)
                : [...habit.completedDates, date],
              streak: isCompleted ? habit.streak - 1 : habit.streak + 1,
            };
          }),
        })),
      removeHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((habit) => habit.id !== id),
        })),
      getHabitsByCategory: (category) =>
        get().habits.filter((habit) => habit.category === category),
    }),
    { name: "habit-storage" }
  )
);
