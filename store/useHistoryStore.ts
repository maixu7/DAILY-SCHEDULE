import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DailyReport {
  date: string;
  exercisePercent: number;
  exerciseProgress: number;
  studyPercent: number;
  studyProgress: number;
  japanesePercent: number;
  japaneseProgress: number;
  overallPercent: number;
  overallProgress: number;
  waterGlasses: number;
  sleepHours: number;
  tasksCompleted: number;
  totalTasks: number;
}

export interface MonthlyReport {
  month: string;
  year: number;
  avgExercise: number;
  avgStudy: number;
  avgJapanese: number;
  avgOverall: number;
  totalDays: number;
  perfectDays: number;
}

export interface SkillLevel {
  id: string;
  name: string;
  category: "frontend" | "backend" | "devops" | "japanese";
  level: number;
  maxLevel: number;
  xp: number;
  xpToNext: number;
}

export interface JLPTProgress {
  level: "N5" | "N4" | "N3" | "N2" | "N1";
  vocabulary: number;
  grammar: number;
  reading: number;
  listening: number;
  kanji: number;
}

interface HistoryState {
  dailyReports: DailyReport[];
  reports: DailyReport[]; // alias for analytics
  monthlyReports: MonthlyReport[];
  skillLevels: SkillLevel[];
  jlptProgress: JLPTProgress[];
  
  // Actions
  saveDailyReport: (report: DailyReport) => void;
  updateSkillLevel: (id: string, xpGain: number) => void;
  setSkillLevel: (id: string, level: number) => void;
  updateJLPTProgress: (level: string, field: string, value: number) => void;
  getDailyReport: (date: string) => DailyReport | undefined;
  getMonthlyReport: (month: string, year: number) => MonthlyReport | undefined;
  calculateMonthlyReport: (month: number, year: number) => MonthlyReport;
  clearHistory: () => void;
}

const defaultSkillLevels: SkillLevel[] = [
  { id: "html", name: "HTML", category: "frontend", level: 3, maxLevel: 10, xp: 450, xpToNext: 500 },
  { id: "css", name: "CSS", category: "frontend", level: 2, maxLevel: 10, xp: 280, xpToNext: 400 },
  { id: "javascript", name: "JavaScript", category: "frontend", level: 2, maxLevel: 10, xp: 320, xpToNext: 400 },
  { id: "react", name: "React", category: "frontend", level: 1, maxLevel: 10, xp: 150, xpToNext: 300 },
  { id: "python", name: "Python", category: "backend", level: 1, maxLevel: 10, xp: 80, xpToNext: 300 },
  { id: "java", name: "Java", category: "backend", level: 1, maxLevel: 10, xp: 50, xpToNext: 300 },
  { id: "nodejs", name: "Node.js", category: "backend", level: 1, maxLevel: 10, xp: 100, xpToNext: 300 },
  { id: "git", name: "Git", category: "devops", level: 2, maxLevel: 10, xp: 350, xpToNext: 400 },
  { id: "aws", name: "AWS", category: "devops", level: 0, maxLevel: 10, xp: 20, xpToNext: 200 },
  { id: "docker", name: "Docker", category: "devops", level: 0, maxLevel: 10, xp: 10, xpToNext: 200 },
];

const defaultJLPTProgress: JLPTProgress[] = [
  { level: "N5", vocabulary: 100, grammar: 100, reading: 100, listening: 100, kanji: 100 },
  { level: "N4", vocabulary: 85, grammar: 80, reading: 75, listening: 70, kanji: 80 },
  { level: "N3", vocabulary: 45, grammar: 40, reading: 35, listening: 30, kanji: 40 },
  { level: "N2", vocabulary: 15, grammar: 10, reading: 10, listening: 5, kanji: 12 },
  { level: "N1", vocabulary: 0, grammar: 0, reading: 0, listening: 0, kanji: 0 },
];

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      dailyReports: [],
      get reports() {
        return get().dailyReports;
      },
      monthlyReports: [],
      skillLevels: defaultSkillLevels,
      jlptProgress: defaultJLPTProgress,

      saveDailyReport: (report) =>
        set((state) => {
          // Ensure we have the progress fields
          const normalizedReport = {
            ...report,
            exerciseProgress: report.exerciseProgress ?? report.exercisePercent,
            studyProgress: report.studyProgress ?? report.studyPercent,
            japaneseProgress: report.japaneseProgress ?? report.japanesePercent,
            overallProgress: report.overallProgress ?? report.overallPercent,
          };
          const existing = state.dailyReports.findIndex((r) => r.date === normalizedReport.date);
          if (existing >= 0) {
            const updated = [...state.dailyReports];
            updated[existing] = normalizedReport;
            return { dailyReports: updated };
          }
          return { dailyReports: [...state.dailyReports, normalizedReport] };
        }),

      clearHistory: () =>
        set({
          dailyReports: [],
          monthlyReports: [],
          skillLevels: defaultSkillLevels,
          jlptProgress: defaultJLPTProgress,
        }),

      updateSkillLevel: (id, xpGain) =>
        set((state) => ({
          skillLevels: state.skillLevels.map((skill) => {
            if (skill.id !== id) return skill;
            let newXp = skill.xp + xpGain;
            let newLevel = skill.level;
            let newXpToNext = skill.xpToNext;
            
            while (newXp >= newXpToNext && newLevel < skill.maxLevel) {
              newXp -= newXpToNext;
              newLevel++;
              newXpToNext = Math.floor(newXpToNext * 1.5);
            }
            
            return { ...skill, xp: newXp, level: newLevel, xpToNext: newXpToNext };
          }),
        })),

      setSkillLevel: (id, level) =>
        set((state) => ({
          skillLevels: state.skillLevels.map((skill) =>
            skill.id === id ? { ...skill, level: Math.min(level, skill.maxLevel) } : skill
          ),
        })),

      updateJLPTProgress: (level, field, value) =>
        set((state) => ({
          jlptProgress: state.jlptProgress.map((p) =>
            p.level === level ? { ...p, [field]: Math.min(100, Math.max(0, value)) } : p
          ),
        })),

      getDailyReport: (date) => get().dailyReports.find((r) => r.date === date),

      getMonthlyReport: (month, year) =>
        get().monthlyReports.find((r) => r.month === month && r.year === year),

      calculateMonthlyReport: (month, year) => {
        const { dailyReports } = get();
        const monthStr = `${year}-${String(month).padStart(2, "0")}`;
        const monthReports = dailyReports.filter((r) => r.date.startsWith(monthStr));
        
        if (monthReports.length === 0) {
          return {
            month: monthStr,
            year,
            avgExercise: 0,
            avgStudy: 0,
            avgJapanese: 0,
            avgOverall: 0,
            totalDays: 0,
            perfectDays: 0,
          };
        }

        const avgExercise = Math.round(
          monthReports.reduce((acc, r) => acc + r.exercisePercent, 0) / monthReports.length
        );
        const avgStudy = Math.round(
          monthReports.reduce((acc, r) => acc + r.studyPercent, 0) / monthReports.length
        );
        const avgJapanese = Math.round(
          monthReports.reduce((acc, r) => acc + r.japanesePercent, 0) / monthReports.length
        );
        const avgOverall = Math.round(
          monthReports.reduce((acc, r) => acc + r.overallPercent, 0) / monthReports.length
        );
        const perfectDays = monthReports.filter((r) => r.overallPercent >= 90).length;

        return {
          month: monthStr,
          year,
          avgExercise,
          avgStudy,
          avgJapanese,
          avgOverall,
          totalDays: monthReports.length,
          perfectDays,
        };
      },
    }),
    { name: "history-storage" }
  )
);
