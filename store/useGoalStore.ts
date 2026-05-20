import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: "health" | "japanese" | "skills" | "personal";
  targetDate: string;
  progress: number;
  milestones: Milestone[];
  status: "active" | "completed" | "paused";
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedDate?: string;
}

interface GoalState {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, "id" | "progress" | "status">) => void;
  updateGoalProgress: (id: string, progress: number) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  removeGoal: (id: string) => void;
  getGoalsByCategory: (category: Goal["category"]) => Goal[];
}

export const useGoalStore = create<GoalState>()(
  persist(
    (set, get) => ({
      goals: [
        {
          id: "1",
          title: "JLPT N2 Certification",
          description: "Pass the Japanese Language Proficiency Test N2",
          category: "japanese",
          targetDate: "2026-07-01",
          progress: 75,
          status: "active",
          milestones: [
            { id: "1a", title: "Complete Kanji Book", completed: true, completedDate: "2026-01-15" },
            { id: "1b", title: "Finish Grammar Course", completed: true, completedDate: "2026-03-01" },
            { id: "1c", title: "Practice Tests", completed: false },
            { id: "1d", title: "Take N2 Exam", completed: false },
          ],
        },
        {
          id: "2",
          title: "AWS Solutions Architect",
          description: "Earn AWS Solutions Architect Professional certification",
          category: "skills",
          targetDate: "2026-09-01",
          progress: 45,
          status: "active",
          milestones: [
            { id: "2a", title: "Complete Course", completed: true, completedDate: "2026-02-20" },
            { id: "2b", title: "Hands-on Labs", completed: false },
            { id: "2c", title: "Practice Exams", completed: false },
            { id: "2d", title: "Take Certification", completed: false },
          ],
        },
        {
          id: "3",
          title: "Run a Half Marathon",
          description: "Complete a 21km half marathon under 2 hours",
          category: "health",
          targetDate: "2026-10-15",
          progress: 30,
          status: "active",
          milestones: [
            { id: "3a", title: "Run 10km consistently", completed: true, completedDate: "2026-04-01" },
            { id: "3b", title: "Complete 15km run", completed: false },
            { id: "3c", title: "Training plan completion", completed: false },
            { id: "3d", title: "Race day", completed: false },
          ],
        },
      ],
      addGoal: (goal) =>
        set((state) => ({
          goals: [
            ...state.goals,
            { ...goal, id: Date.now().toString(), progress: 0, status: "active" },
          ],
        })),
      updateGoalProgress: (id, progress) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id
              ? { ...goal, progress, status: progress >= 100 ? "completed" : goal.status }
              : goal
          ),
        })),
      toggleMilestone: (goalId, milestoneId) =>
        set((state) => ({
          goals: state.goals.map((goal) => {
            if (goal.id !== goalId) return goal;
            const updatedMilestones = goal.milestones.map((m) =>
              m.id === milestoneId
                ? {
                    ...m,
                    completed: !m.completed,
                    completedDate: !m.completed ? new Date().toISOString().split("T")[0] : undefined,
                  }
                : m
            );
            const completedCount = updatedMilestones.filter((m) => m.completed).length;
            const progress = Math.round((completedCount / updatedMilestones.length) * 100);
            return { ...goal, milestones: updatedMilestones, progress };
          }),
        })),
      removeGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        })),
      getGoalsByCategory: (category) =>
        get().goals.filter((goal) => goal.category === category),
    }),
    { name: "goal-storage" }
  )
);
