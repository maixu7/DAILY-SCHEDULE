import { create } from "zustand";

type ExerciseSet = {

  reps: number;

  completed: boolean;

};

type Exercise = {

  id: string;

  name: string;

  sets: ExerciseSet[];

};

type Tracker = {

  id: string;

  label: string;

  value: number;

  goal: number;

};

type WorkoutHistoryItem = {

  date: string;

  duration: number;

  exercisesDone: number;

};

type DailyStore = {

  exercises: Exercise[];

  trackers: Tracker[];

  history: WorkoutHistoryItem[];

  // timer

  isTimerRunning: boolean;

  timerSeconds: number;

  // UI

  showHistory: boolean;

  // exercise actions

  addExercise: (name: string, sets: number, reps: number) => void;

  removeExercise: (id: string) => void;

  toggleExerciseSet: (exerciseId: string, setIndex: number) => void;

  // trackers

  incrementTracker: (id: string) => void;

  decrementTracker: (id: string) => void;

  // progress

  getExercisePercentage: (id: string) => number;

  // timer actions

  startTimer: () => void;

  stopTimer: () => void;

  resetTimer: () => void;

  // history

  addHistory: (item: WorkoutHistoryItem) => void;

  toggleHistory: () => void;

};

// safe helper (prevents NaN%)

const safePercent = (done: number, total: number) => {

  if (!total) return 0;

  return Math.round((done / total) * 100);

};

export const useDailyStore = create<DailyStore>((set, get) => ({

  exercises: [],

  trackers: [],

  history: [],

  isTimerRunning: false,

  timerSeconds: 0,

  showHistory: false,

  addExercise: (name, sets, reps) =>

    set((state) => ({

      exercises: [

        ...state.exercises,

        {

          id: crypto.randomUUID(),

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

      exercises: state.exercises.filter((e) => e.id !== id),

    })),

  toggleExerciseSet: (exerciseId, setIndex) =>

    set((state) => ({

      exercises: state.exercises.map((ex) => {

        if (ex.id !== exerciseId) return ex;

        const updatedSets = ex.sets.map((s, i) =>

          i === setIndex ? { ...s, completed: !s.completed } : s

        );

        return { ...ex, sets: updatedSets };

      }),

    })),

  incrementTracker: (id) =>

    set((state) => ({

      trackers: state.trackers.map((t) =>
t.id === id ? { ...t, value: t.value + 1 } : t

      ),

    })),

  decrementTracker: (id) =>

    set((state) => ({

      trackers: state.trackers.map((t) =>
t.id === id ? { ...t, value: Math.max(0, t.value - 1) } : t

      ),

    })),

  getExercisePercentage: (id) => {

    const ex = get().exercises.find((e) => e.id === id);

    if (!ex) return 0;

    const total = ex.sets.length;

    const done = ex.sets.filter((s) => s.completed).length;

    return safePercent(done, total);

  },

  startTimer: () => {

    set({ isTimerRunning: true });

    const interval = setInterval(() => {

      const state = get();

      if (!state.isTimerRunning) {

        clearInterval(interval);

        return;

      }

      set({ timerSeconds: state.timerSeconds + 1 });

    }, 1000);

  },

  stopTimer: () =>

    set({ isTimerRunning: false }),

  resetTimer: () =>

    set({ timerSeconds: 0, isTimerRunning: false }),

  addHistory: (item) =>

    set((state) => ({

      history: [item, ...state.history],

    })),

  toggleHistory: () =>

    set((state) => ({

      showHistory: !state.showHistory,

    })),

}));
 