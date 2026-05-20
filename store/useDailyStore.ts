import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  repsPerSet: number;
  completedSets: number;
  completedReps: number[];
  unit: string;
  category: "push" | "pull" | "legs" | "core" | "cardio";
}

export interface StudyTask {
  id: string;
  name: string;
  description: string;
  targetMinutes: number;
  completedMinutes: number;
  category: "html" | "css" | "javascript" | "python" | "java" | "git" | "aws" | "react" | "nodejs";
  completed: boolean;
  resources: { title: string; url: string; type: "youtube" | "article" | "docs" }[];
}

export interface JapaneseTask {
  id: string;
  name: string;
  description: string;
  targetMinutes: number;
  completedMinutes: number;
  category: "vocabulary" | "speaking" | "keigo" | "reading" | "listening" | "grammar";
  completed: boolean;
  level: "N5" | "N4" | "N3" | "N2" | "N1";
  resources: { title: string; url: string; type: "youtube" | "article" | "book" }[];
}

export interface ReadingItem {
  id: string;
  title: string;
  type: "manga" | "article" | "book" | "news" | "novel";
  level: "N5" | "N4" | "N3" | "N2" | "N1";
  totalPages: number;
  readPages: number;
  readingTimeMinutes: number;
  studyTimeMinutes: number;
  completed: boolean;
}

export interface DailyTracker {
  id: string;
  name: string;
  target: number;
  completed: number;
  unit: string;
  icon: string;
}

export interface RoutineItem {
  id: string;
  time: string;
  task: string;
  icon: string;
  completed: boolean;
  linkedSection: "health" | "japanese" | "skills" | null;
  editable: boolean;
}

interface DailyState {
  date: string;
  exercises: Exercise[];
  studyTasks: StudyTask[];
  japaneseTasks: JapaneseTask[];
  readingItems: ReadingItem[];
  dailyTrackers: DailyTracker[];
  morningRoutine: RoutineItem[];
  eveningRoutine: RoutineItem[];

  // Exercise actions
  updateExerciseSet: (id: string, setIndex: number, reps: number) => void;
  completeExerciseSet: (id: string, setIndex: number) => void;
  addExercise: (exercise: Omit<Exercise, "id" | "completedSets" | "completedReps">) => void;
  removeExercise: (id: string) => void;
  updateExerciseTarget: (id: string, sets: number, repsPerSet: number) => void;

  // Study actions
  updateStudyTask: (id: string, completedMinutes: number) => void;
  toggleStudyTask: (id: string) => void;
  addStudyTask: (task: Omit<StudyTask, "id">) => void;
  removeStudyTask: (id: string) => void;

  // Japanese actions
  updateJapaneseTask: (id: string, completedMinutes: number) => void;
  toggleJapaneseTask: (id: string) => void;
  addJapaneseTask: (task: Omit<JapaneseTask, "id">) => void;
  removeJapaneseTask: (id: string) => void;

  // Reading actions
  updateReading: (id: string, field: string, value: number) => void;
  addReadingItem: (item: Omit<ReadingItem, "id">) => void;
  removeReadingItem: (id: string) => void;
  toggleReadingComplete: (id: string) => void;

  // Daily tracker actions
  updateDailyTracker: (id: string, completed: number) => void;
  incrementTracker: (id: string) => void;
  decrementTracker: (id: string) => void;

  // Routine actions
  toggleRoutineItem: (type: "morning" | "evening", id: string) => void;
  updateRoutineTime: (type: "morning" | "evening", id: string, time: string) => void;
  addRoutineItem: (type: "morning" | "evening", item: Omit<RoutineItem, "id">) => void;

  // Stats
  getExercisePercentage: () => number;
  getStudyPercentage: () => number;
  getJapanesePercentage: () => number;
  getReadingPercentage: () => number;
  getOverallPercentage: () => number;
  getMorningRoutinePercentage: () => number;
  getEveningRoutinePercentage: () => number;

  // Reset
  resetDaily: () => void;
}

const getToday = () => new Date().toISOString().split("T")[0];

const defaultExercises: Exercise[] = [
  { id: "1", name: "Push-ups", sets: 4, repsPerSet: 15, completedSets: 0, completedReps: [0, 0, 0, 0], unit: "reps", category: "push" },
  { id: "2", name: "Pull-ups", sets: 4, repsPerSet: 8, completedSets: 0, completedReps: [0, 0, 0, 0], unit: "reps", category: "pull" },
  { id: "3", name: "Dumbbell Press", sets: 3, repsPerSet: 12, completedSets: 0, completedReps: [0, 0, 0], unit: "reps", category: "push" },
  { id: "4", name: "Dips", sets: 3, repsPerSet: 10, completedSets: 0, completedReps: [0, 0, 0], unit: "reps", category: "push" },
  { id: "5", name: "Ab Wheel", sets: 3, repsPerSet: 10, completedSets: 0, completedReps: [0, 0, 0], unit: "reps", category: "core" },
  { id: "6", name: "Squats", sets: 4, repsPerSet: 15, completedSets: 0, completedReps: [0, 0, 0, 0], unit: "reps", category: "legs" },
  { id: "7", name: "Kettlebell Swings", sets: 3, repsPerSet: 20, completedSets: 0, completedReps: [0, 0, 0], unit: "reps", category: "cardio" },
  { id: "8", name: "Rows", sets: 4, repsPerSet: 12, completedSets: 0, completedReps: [0, 0, 0, 0], unit: "reps", category: "pull" },
];

const defaultStudyTasks: StudyTask[] = [
  {
    id: "1",
    name: "HTML Forms & Inputs",
    description: "Practice form elements: input types, labels, validation attributes",
    targetMinutes: 30,
    completedMinutes: 0,
    category: "html",
    completed: false,
    resources: [
      { title: "HTML Forms Tutorial", url: "https://www.youtube.com/results?search_query=html+forms+tutorial", type: "youtube" },
      { title: "MDN Forms Guide", url: "https://developer.mozilla.org/en-US/docs/Learn/Forms", type: "docs" },
    ],
  },
  {
    id: "2",
    name: "CSS Flexbox Layout",
    description: "Master flexbox: justify-content, align-items, flex-wrap, gap",
    targetMinutes: 30,
    completedMinutes: 0,
    category: "css",
    completed: false,
    resources: [
      { title: "Flexbox Crash Course", url: "https://www.youtube.com/results?search_query=css+flexbox+tutorial", type: "youtube" },
      { title: "CSS Tricks Flexbox Guide", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/", type: "article" },
    ],
  },
  {
    id: "3",
    name: "JavaScript Arrays & Methods",
    description: "Practice map, filter, reduce, forEach, find, some, every",
    targetMinutes: 45,
    completedMinutes: 0,
    category: "javascript",
    completed: false,
    resources: [
      { title: "JS Array Methods", url: "https://www.youtube.com/results?search_query=javascript+array+methods", type: "youtube" },
      { title: "MDN Array Reference", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array", type: "docs" },
    ],
  },
  {
    id: "4",
    name: "Python Lists & Dictionaries",
    description: "Practice list comprehensions, dictionary methods, iteration",
    targetMinutes: 30,
    completedMinutes: 0,
    category: "python",
    completed: false,
    resources: [
      { title: "Python Data Structures", url: "https://www.youtube.com/results?search_query=python+lists+dictionaries", type: "youtube" },
      { title: "Python Docs", url: "https://docs.python.org/3/tutorial/datastructures.html", type: "docs" },
    ],
  },
  {
    id: "5",
    name: "Git Branching & Merging",
    description: "Practice creating branches, merging, resolving conflicts",
    targetMinutes: 20,
    completedMinutes: 0,
    category: "git",
    completed: false,
    resources: [
      { title: "Git Branching Tutorial", url: "https://www.youtube.com/results?search_query=git+branching+merging", type: "youtube" },
      { title: "Git Documentation", url: "https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging", type: "docs" },
    ],
  },
];

const defaultJapaneseTasks: JapaneseTask[] = [
  {
    id: "1",
    name: "Vocabulary Review",
    description: "Review N3 vocabulary: business terms, compound verbs, adverbs",
    targetMinutes: 20,
    completedMinutes: 0,
    category: "vocabulary",
    completed: false,
    level: "N3",
    resources: [
      { title: "N3 Vocabulary List", url: "https://www.youtube.com/results?search_query=jlpt+n3+vocabulary", type: "youtube" },
      { title: "Jisho Dictionary", url: "https://jisho.org/", type: "article" },
    ],
  },
  {
    id: "2",
    name: "Speaking Practice",
    description: "Practice shadowing with native content, record yourself",
    targetMinutes: 30,
    completedMinutes: 0,
    category: "speaking",
    completed: false,
    level: "N3",
    resources: [
      { title: "Shadowing Practice", url: "https://www.youtube.com/results?search_query=japanese+shadowing+practice", type: "youtube" },
    ],
  },
  {
    id: "3",
    name: "Keigo/Business Japanese",
    description: "Study honorific and humble forms, business email writing",
    targetMinutes: 20,
    completedMinutes: 0,
    category: "keigo",
    completed: false,
    level: "N2",
    resources: [
      { title: "Business Japanese", url: "https://www.youtube.com/results?search_query=business+japanese+keigo", type: "youtube" },
    ],
  },
  {
    id: "4",
    name: "Reading Practice",
    description: "Read NHK News Easy articles, manga, or light novels",
    targetMinutes: 30,
    completedMinutes: 0,
    category: "reading",
    completed: false,
    level: "N3",
    resources: [
      { title: "NHK News Easy", url: "https://www3.nhk.or.jp/news/easy/", type: "article" },
      { title: "Satori Reader", url: "https://www.satorireader.com/", type: "article" },
    ],
  },
  {
    id: "5",
    name: "Listening Immersion",
    description: "Watch Japanese content without subtitles, podcasts",
    targetMinutes: 30,
    completedMinutes: 0,
    category: "listening",
    completed: false,
    level: "N3",
    resources: [
      { title: "Japanese Podcasts", url: "https://www.youtube.com/results?search_query=japanese+listening+practice", type: "youtube" },
    ],
  },
];

const defaultReadingItems: ReadingItem[] = [
  { id: "1", title: "NHK News Easy - Daily Article", type: "news", level: "N4", totalPages: 1, readPages: 0, readingTimeMinutes: 0, studyTimeMinutes: 0, completed: false },
  { id: "2", title: "Yotsuba&! Volume 1", type: "manga", level: "N4", totalPages: 200, readPages: 45, readingTimeMinutes: 0, studyTimeMinutes: 0, completed: false },
  { id: "3", title: "Japanese Short Stories for Beginners", type: "book", level: "N4", totalPages: 150, readPages: 30, readingTimeMinutes: 0, studyTimeMinutes: 0, completed: false },
];

const defaultDailyTrackers: DailyTracker[] = [
  { id: "1", name: "Water Intake", target: 8, completed: 0, unit: "glasses", icon: "Droplets" },
  { id: "2", name: "Sleep Hours", target: 8, completed: 0, unit: "hours", icon: "Moon" },
  { id: "3", name: "Steps", target: 10000, completed: 0, unit: "steps", icon: "Footprints" },
  { id: "4", name: "Calories Burned", target: 500, completed: 0, unit: "kcal", icon: "Flame" },
  { id: "5", name: "Mood Level", target: 10, completed: 5, unit: "/10", icon: "Smile" },
  { id: "6", name: "Energy Level", target: 10, completed: 5, unit: "/10", icon: "Zap" },
];

const defaultMorningRoutine: RoutineItem[] = [
  { id: "1", time: "5:30", task: "Wake Up", icon: "Sun", completed: false, linkedSection: null, editable: true },
  { id: "2", time: "5:35", task: "Drink Water", icon: "Droplets", completed: false, linkedSection: null, editable: true },
  { id: "3", time: "5:40", task: "Warm Shower", icon: "Thermometer", completed: false, linkedSection: null, editable: true },
  { id: "4", time: "6:00", task: "Meditation (15 min)", icon: "Brain", completed: false, linkedSection: null, editable: true },
  { id: "5", time: "6:15", task: "Reading & Journal", icon: "BookOpen", completed: false, linkedSection: "japanese", editable: true },
  { id: "6", time: "6:30", task: "Workout Session", icon: "Dumbbell", completed: false, linkedSection: "health", editable: true },
  { id: "7", time: "8:00", task: "Japanese Study", icon: "BookMarked", completed: false, linkedSection: "japanese", editable: true },
  { id: "8", time: "9:00", task: "IT Practice", icon: "Code", completed: false, linkedSection: "skills", editable: true },
];

const defaultEveningRoutine: RoutineItem[] = [
  { id: "e1", time: "18:00", task: "Review Daily Goals", icon: "CheckSquare", completed: false, linkedSection: null, editable: true },
  { id: "e2", time: "18:30", task: "Light Exercise/Walk", icon: "Footprints", completed: false, linkedSection: "health", editable: true },
  { id: "e3", time: "19:00", task: "Dinner", icon: "Coffee", completed: false, linkedSection: null, editable: true },
  { id: "e4", time: "20:00", task: "Reading/Learning", icon: "BookOpen", completed: false, linkedSection: "japanese", editable: true },
  { id: "e5", time: "21:00", task: "Tomorrow Planning", icon: "Calendar", completed: false, linkedSection: null, editable: true },
  { id: "e6", time: "21:30", task: "Digital Detox", icon: "Moon", completed: false, linkedSection: null, editable: true },
  { id: "e7", time: "22:00", task: "Sleep Preparation", icon: "Moon", completed: false, linkedSection: null, editable: true },
  { id: "e8", time: "22:30", task: "Sleep", icon: "Moon", completed: false, linkedSection: null, editable: true },
];

export const useDailyStore = create<DailyState>()(
  persist(
    (set, get) => ({
      date: getToday(),
      exercises: defaultExercises,
      studyTasks: defaultStudyTasks,
      japaneseTasks: defaultJapaneseTasks,
      readingItems: defaultReadingItems,
      dailyTrackers: defaultDailyTrackers,
      morningRoutine: defaultMorningRoutine,
      eveningRoutine: defaultEveningRoutine,

      updateExerciseSet: (id, setIndex, reps) =>
        set((state) => ({
          exercises: state.exercises.map((e) => {
            if (e.id !== id) return e;
            const newReps = [...e.completedReps];
            newReps[setIndex] = reps;
            const completedSets = newReps.filter((r, i) => r >= e.repsPerSet || (i < setIndex && newReps[i] > 0)).length;
            return { ...e, completedReps: newReps, completedSets };
          }),
        })),

      completeExerciseSet: (id, setIndex) =>
        set((state) => ({
          exercises: state.exercises.map((e) => {
            if (e.id !== id) return e;
            const newReps = [...e.completedReps];
            newReps[setIndex] = e.repsPerSet;
            const completedSets = newReps.filter((r) => r >= e.repsPerSet).length;
            return { ...e, completedReps: newReps, completedSets };
          }),
        })),

      addExercise: (exercise) =>
        set((state) => ({
          exercises: [
            ...state.exercises,
            {
              ...exercise,
              id: Date.now().toString(),
              completedSets: 0,
              completedReps: Array(exercise.sets).fill(0),
            },
          ],
        })),

      removeExercise: (id) =>
        set((state) => ({
          exercises: state.exercises.filter((e) => e.id !== id),
        })),

      updateExerciseTarget: (id, sets, repsPerSet) =>
        set((state) => ({
          exercises: state.exercises.map((e) =>
            e.id === id
              ? {
                  ...e,
                  sets,
                  repsPerSet,
                  completedReps: Array(sets).fill(0),
                  completedSets: 0,
                }
              : e
          ),
        })),

      updateStudyTask: (id, completedMinutes) =>
        set((state) => ({
          studyTasks: state.studyTasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  completedMinutes: Math.min(completedMinutes, t.targetMinutes * 2),
                  completed: completedMinutes >= t.targetMinutes,
                }
              : t
          ),
        })),

      toggleStudyTask: (id) =>
        set((state) => ({
          studyTasks: state.studyTasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  completed: !t.completed,
                  completedMinutes: !t.completed ? t.targetMinutes : 0,
                }
              : t
          ),
        })),

      addStudyTask: (task) =>
        set((state) => ({
          studyTasks: [...state.studyTasks, { ...task, id: Date.now().toString() }],
        })),

      removeStudyTask: (id) =>
        set((state) => ({
          studyTasks: state.studyTasks.filter((t) => t.id !== id),
        })),

      updateJapaneseTask: (id, completedMinutes) =>
        set((state) => ({
          japaneseTasks: state.japaneseTasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  completedMinutes: Math.min(completedMinutes, t.targetMinutes * 2),
                  completed: completedMinutes >= t.targetMinutes,
                }
              : t
          ),
        })),

      toggleJapaneseTask: (id) =>
        set((state) => ({
          japaneseTasks: state.japaneseTasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  completed: !t.completed,
                  completedMinutes: !t.completed ? t.targetMinutes : 0,
                }
              : t
          ),
        })),

      addJapaneseTask: (task) =>
        set((state) => ({
          japaneseTasks: [...state.japaneseTasks, { ...task, id: Date.now().toString() }],
        })),

      removeJapaneseTask: (id) =>
        set((state) => ({
          japaneseTasks: state.japaneseTasks.filter((t) => t.id !== id),
        })),

      updateReading: (id, field, value) =>
        set((state) => ({
          readingItems: state.readingItems.map((r) =>
            r.id === id ? { ...r, [field]: value } : r
          ),
        })),

      addReadingItem: (item) =>
        set((state) => ({
          readingItems: [...state.readingItems, { ...item, id: Date.now().toString() }],
        })),

      removeReadingItem: (id) =>
        set((state) => ({
          readingItems: state.readingItems.filter((r) => r.id !== id),
        })),

      toggleReadingComplete: (id) =>
        set((state) => ({
          readingItems: state.readingItems.map((r) =>
            r.id === id ? { ...r, completed: !r.completed } : r
          ),
        })),

      updateDailyTracker: (id, completed) =>
        set((state) => ({
          dailyTrackers: state.dailyTrackers.map((t) =>
            t.id === id ? { ...t, completed: Math.max(0, completed) } : t
          ),
        })),

      incrementTracker: (id) =>
        set((state) => ({
          dailyTrackers: state.dailyTrackers.map((t) =>
            t.id === id ? { ...t, completed: t.completed + 1 } : t
          ),
        })),

      decrementTracker: (id) =>
        set((state) => ({
          dailyTrackers: state.dailyTrackers.map((t) =>
            t.id === id ? { ...t, completed: Math.max(0, t.completed - 1) } : t
          ),
        })),

      toggleRoutineItem: (type, id) =>
        set((state) => ({
          [type === "morning" ? "morningRoutine" : "eveningRoutine"]: (
            type === "morning" ? state.morningRoutine : state.eveningRoutine
          ).map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)),
        })),

      updateRoutineTime: (type, id, time) =>
        set((state) => ({
          [type === "morning" ? "morningRoutine" : "eveningRoutine"]: (
            type === "morning" ? state.morningRoutine : state.eveningRoutine
          ).map((item) => (item.id === id ? { ...item, time } : item)),
        })),

      addRoutineItem: (type, item) =>
        set((state) => ({
          [type === "morning" ? "morningRoutine" : "eveningRoutine"]: [
            ...(type === "morning" ? state.morningRoutine : state.eveningRoutine),
            { ...item, id: Date.now().toString() },
          ],
        })),

      getExercisePercentage: () => {
        const { exercises } = get();
        if (exercises.length === 0) return 0;
        const totalSets = exercises.reduce((acc, e) => acc + e.sets, 0);
        const completedSets = exercises.reduce((acc, e) => acc + e.completedSets, 0);
        return totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
      },

      getStudyPercentage: () => {
        const { studyTasks } = get();
        if (studyTasks.length === 0) return 0;
        const completed = studyTasks.filter((t) => t.completed).length;
        return Math.round((completed / studyTasks.length) * 100);
      },

      getJapanesePercentage: () => {
        const { japaneseTasks } = get();
        if (japaneseTasks.length === 0) return 0;
        const completed = japaneseTasks.filter((t) => t.completed).length;
        return Math.round((completed / japaneseTasks.length) * 100);
      },

      getReadingPercentage: () => {
        const { readingItems } = get();
        if (readingItems.length === 0) return 0;
        const totalProgress = readingItems.reduce(
          (acc, r) => acc + (r.totalPages > 0 ? r.readPages / r.totalPages : 0),
          0
        );
        return Math.round((totalProgress / readingItems.length) * 100);
      },

      getOverallPercentage: () => {
        const exercisePercent = get().getExercisePercentage();
        const studyPercent = get().getStudyPercentage();
        const japanesePercent = get().getJapanesePercentage();
        return Math.round((exercisePercent + studyPercent + japanesePercent) / 3);
      },

      getMorningRoutinePercentage: () => {
        const { morningRoutine } = get();
        if (morningRoutine.length === 0) return 0;
        const completed = morningRoutine.filter((r) => r.completed).length;
        return Math.round((completed / morningRoutine.length) * 100);
      },

      getEveningRoutinePercentage: () => {
        const { eveningRoutine } = get();
        if (eveningRoutine.length === 0) return 0;
        const completed = eveningRoutine.filter((r) => r.completed).length;
        return Math.round((completed / eveningRoutine.length) * 100);
      },

      resetDaily: () =>
        set({
          date: getToday(),
          exercises: defaultExercises,
          studyTasks: defaultStudyTasks,
          japaneseTasks: defaultJapaneseTasks,
          readingItems: defaultReadingItems,
          dailyTrackers: defaultDailyTrackers,
          morningRoutine: defaultMorningRoutine,
          eveningRoutine: defaultEveningRoutine,
        }),
    }),
    { name: "daily-storage-v2" }
  )
);
