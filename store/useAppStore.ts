import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: "general" | "japanese" | "skills" | "health" | "personal";
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: "youtube" | "article" | "pdf" | "book" | "course";
  category: "japanese" | "skills" | "health" | "personal";
  tags: string[];
  notes: string;
  completed: boolean;
  addedAt: string;
}

export interface FocusSession {
  id: string;
  type: "pomodoro" | "deep-work" | "study";
  duration: number;
  completedAt: string;
  category: "japanese" | "skills" | "health" | "personal";
}

export interface WeeklyReview {
  id: string;
  weekStart: string;
  weekEnd: string;
  improvements: string;
  failures: string;
  habitsWorked: string;
  goalsProgress: string;
  nextWeekFocus: string;
  overallScore: number;
  createdAt: string;
}

export interface AppSettings {
  theme: "dark" | "light" | "system";
  accentColor: string;
  showCompletedTasks: boolean;
  pomodoroWork: number;
  pomodoroBreak: number;
  pomodoroLongBreak: number;
  dailyGoalHours: number;
  notificationsEnabled: boolean;
}

interface AppState {
  // Settings
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;

  // Tags
  tags: Tag[];
  addTag: (tag: Omit<Tag, "id">) => void;
  removeTag: (id: string) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;

  // Notes (Knowledge Vault)
  notes: Note[];
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  removeNote: (id: string) => void;
  toggleNotePin: (id: string) => void;

  // Resources
  resources: Resource[];
  addResource: (resource: Omit<Resource, "id" | "addedAt">) => void;
  updateResource: (id: string, updates: Partial<Resource>) => void;
  removeResource: (id: string) => void;
  toggleResourceComplete: (id: string) => void;

  // Focus Sessions
  focusSessions: FocusSession[];
  addFocusSession: (session: Omit<FocusSession, "id" | "completedAt">) => void;
  getTotalFocusTime: (category?: string) => number;
  getTodayFocusTime: () => number;

  // Weekly Reviews
  weeklyReviews: WeeklyReview[];
  addWeeklyReview: (review: Omit<WeeklyReview, "id" | "createdAt">) => void;
  updateWeeklyReview: (id: string, updates: Partial<WeeklyReview>) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: () => { notes: Note[]; resources: Resource[] };

  // Export/Import
  exportAllData: () => string;
  importData: (data: string) => boolean;
  resetAllProgress: () => void;
}

const defaultSettings: AppSettings = {
  theme: "dark",
  accentColor: "#06b6d4",
  showCompletedTasks: true,
  pomodoroWork: 25,
  pomodoroBreak: 5,
  pomodoroLongBreak: 15,
  dailyGoalHours: 8,
  notificationsEnabled: true,
};

const defaultTags: Tag[] = [
  { id: "1", name: "N1", color: "#ef4444" },
  { id: "2", name: "N2", color: "#f97316" },
  { id: "3", name: "N3", color: "#eab308" },
  { id: "4", name: "React", color: "#06b6d4" },
  { id: "5", name: "JavaScript", color: "#facc15" },
  { id: "6", name: "Important", color: "#ec4899" },
  { id: "7", name: "Workout", color: "#22c55e" },
  { id: "8", name: "Business", color: "#8b5cf6" },
];

const defaultNotes: Note[] = [
  {
    id: "1",
    title: "Japanese Grammar Notes",
    content: "Key grammar patterns for N2:\n- ～ものの (although)\n- ～つつある (in the process of)\n- ～に際して (on the occasion of)",
    tags: ["2"],
    category: "japanese",
    createdAt: "2026-01-15",
    updatedAt: "2026-05-01",
    pinned: true,
  },
  {
    id: "2",
    title: "React Best Practices",
    content: "1. Use functional components\n2. Custom hooks for logic\n3. Memoization for performance\n4. Proper error boundaries",
    tags: ["4"],
    category: "skills",
    createdAt: "2026-02-01",
    updatedAt: "2026-04-15",
    pinned: false,
  },
];

const defaultResources: Resource[] = [
  {
    id: "1",
    title: "Anki Flashcards",
    url: "https://apps.ankiweb.net/",
    type: "course",
    category: "japanese",
    tags: ["2", "3"],
    notes: "Daily vocabulary review",
    completed: false,
    addedAt: "2026-01-01",
  },
  {
    id: "2",
    title: "NHK News Easy",
    url: "https://www3.nhk.or.jp/news/easy/",
    type: "article",
    category: "japanese",
    tags: ["3"],
    notes: "Daily reading practice",
    completed: false,
    addedAt: "2026-01-01",
  },
  {
    id: "3",
    title: "React Documentation",
    url: "https://react.dev/",
    type: "article",
    category: "skills",
    tags: ["4"],
    notes: "Official React docs",
    completed: false,
    addedAt: "2026-01-15",
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      tags: defaultTags,
      notes: defaultNotes,
      resources: defaultResources,
      focusSessions: [],
      weeklyReviews: [],
      searchQuery: "",

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      addTag: (tag) =>
        set((state) => ({
          tags: [...state.tags, { ...tag, id: Date.now().toString() }],
        })),

      removeTag: (id) =>
        set((state) => ({
          tags: state.tags.filter((t) => t.id !== id),
        })),

      updateTag: (id, updates) =>
        set((state) => ({
          tags: state.tags.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),

      addNote: (note) =>
        set((state) => ({
          notes: [
            ...state.notes,
            {
              ...note,
              id: Date.now().toString(),
              createdAt: new Date().toISOString().split("T")[0],
              updatedAt: new Date().toISOString().split("T")[0],
            },
          ],
        })),

      updateNote: (id, updates) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id
              ? { ...n, ...updates, updatedAt: new Date().toISOString().split("T")[0] }
              : n
          ),
        })),

      removeNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        })),

      toggleNotePin: (id) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, pinned: !n.pinned } : n
          ),
        })),

      addResource: (resource) =>
        set((state) => ({
          resources: [
            ...state.resources,
            {
              ...resource,
              id: Date.now().toString(),
              addedAt: new Date().toISOString().split("T")[0],
            },
          ],
        })),

      updateResource: (id, updates) =>
        set((state) => ({
          resources: state.resources.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),

      removeResource: (id) =>
        set((state) => ({
          resources: state.resources.filter((r) => r.id !== id),
        })),

      toggleResourceComplete: (id) =>
        set((state) => ({
          resources: state.resources.map((r) =>
            r.id === id ? { ...r, completed: !r.completed } : r
          ),
        })),

      addFocusSession: (session) =>
        set((state) => ({
          focusSessions: [
            ...state.focusSessions,
            {
              ...session,
              id: Date.now().toString(),
              completedAt: new Date().toISOString(),
            },
          ],
        })),

      getTotalFocusTime: (category) => {
        const { focusSessions } = get();
        const filtered = category
          ? focusSessions.filter((s) => s.category === category)
          : focusSessions;
        return filtered.reduce((acc, s) => acc + s.duration, 0);
      },

      getTodayFocusTime: () => {
        const { focusSessions } = get();
        const today = new Date().toISOString().split("T")[0];
        return focusSessions
          .filter((s) => s.completedAt.startsWith(today))
          .reduce((acc, s) => acc + s.duration, 0);
      },

      addWeeklyReview: (review) =>
        set((state) => ({
          weeklyReviews: [
            ...state.weeklyReviews,
            {
              ...review,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateWeeklyReview: (id, updates) =>
        set((state) => ({
          weeklyReviews: state.weeklyReviews.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),

      setSearchQuery: (query) => set({ searchQuery: query }),

      searchResults: () => {
        const { searchQuery, notes, resources } = get();
        const query = searchQuery.toLowerCase();
        if (!query) return { notes: [], resources: [] };
        return {
          notes: notes.filter(
            (n) =>
              n.title.toLowerCase().includes(query) ||
              n.content.toLowerCase().includes(query)
          ),
          resources: resources.filter(
            (r) =>
              r.title.toLowerCase().includes(query) ||
              r.notes.toLowerCase().includes(query)
          ),
        };
      },

      exportAllData: () => {
        const state = get();
        return JSON.stringify(
          {
            settings: state.settings,
            tags: state.tags,
            notes: state.notes,
            resources: state.resources,
            focusSessions: state.focusSessions,
            weeklyReviews: state.weeklyReviews,
            exportedAt: new Date().toISOString(),
          },
          null,
          2
        );
      },

      importData: (data) => {
        try {
          const parsed = JSON.parse(data);
          set({
            settings: parsed.settings || defaultSettings,
            tags: parsed.tags || defaultTags,
            notes: parsed.notes || [],
            resources: parsed.resources || [],
            focusSessions: parsed.focusSessions || [],
            weeklyReviews: parsed.weeklyReviews || [],
          });
          return true;
        } catch {
          return false;
        }
      },

      resetAllProgress: () =>
        set({
          focusSessions: [],
          weeklyReviews: [],
          notes: defaultNotes,
          resources: defaultResources,
        }),
    }),
    { name: "app-storage" }
  )
);
