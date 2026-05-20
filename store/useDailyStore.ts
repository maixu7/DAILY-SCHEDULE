import { create } from "zustand";

type SetItem = {
  reps: number;
  completed: boolean;
};

type Exercise = {
  id: string;
  name: string;
  sets: SetItem[];
};

type HistoryItem = {
  date: string;
  duration: number;
  exercisesDone: number;
};

type DailyStore = {
  exercises: Exercise[];
  history: HistoryItem[];

  showHistory: boolean;

  addExercise: (name: string, sets: number, reps: number) => void;
  removeExercise: (id: string) => void;
  toggleExerciseSet: (exerciseId: string, setIndex: number) => void;

  toggleHistory: () => void;

  clearAll: () => void;
};

export const useDailyStore = create<DailyStore>((set) => ({
  exercises: [],
  history: [],
  showHistory: false,

  addExercise: (name, sets, reps) =>
    set((state) => ({
      exercises: [
        ...state.exercises,
        {
          id: Date.now().toString(),
          name,
          sets: Array.from({ length: sets }, () => ({
            reps,
            completed: false,
          })),
        },
      ],
    })),

  removeExercise: (id) =>
    set((state) => ({
      exercises: state.exercises.filter((ex) => ex.id !== id),
    })),

  toggleExerciseSet: (exerciseId, setIndex) =>
    set((state) => ({
      exercises: state.exercises.map((ex) => {
        if (ex.id !== exerciseId) return ex;

        return {
          ...ex,
          sets: ex.sets.map((s, i) =>
            i === setIndex ? { ...s, completed: !s.completed } : s
          ),
        };
      }),
    })),

  toggleHistory: () =>
    set((state) => ({
      showHistory: !state.showHistory,
    })),

  clearAll: () =>
    set(() => ({
      exercises: [],
    })),
}));