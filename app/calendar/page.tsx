"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Dumbbell,
  BookOpen,
  Code2,
  TrendingUp,
  Target,
  Edit3,
  Check,
  X,
  Plus,
  Minus,
  Droplets,
  Moon,
  Footprints,
  Flame,
  Smile,
  Zap,
  Star,
  Award,
} from "lucide-react";
import { useDailyStore } from "@/store/useDailyStore";
import { useHistoryStore } from "@/store/useHistoryStore";

// Helper function to get days in a month
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

// Helper function to get first day of the month (0 = Sunday, 1 = Monday, etc.)
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

// Month names
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Icon mapping for trackers
const trackerIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Droplets,
  Moon,
  Footprints,
  Flame,
  Smile,
  Zap,
};

export default function CalendarPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);
  const [editMode, setEditMode] = useState(false);

  // Stores
  const {
    exercises,
    studyTasks,
    japaneseTasks,
    dailyTrackers,
    getExercisePercentage,
    getStudyPercentage,
    getJapanesePercentage,
    getOverallPercentage,
    toggleStudyTask,
    toggleJapaneseTask,
    incrementTracker,
    decrementTracker,
  } = useDailyStore();

  const {
    dailyReports,
    saveDailyReport,
    getDailyReport,
    calculateMonthlyReport,
  } = useHistoryStore();

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days: (Date | null)[] = [];
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    // Add empty slots for days before the first day
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(currentYear, currentMonth, day));
    }

    return days;
  }, [currentMonth, currentYear]);

  // Get daily data for a specific date
  const getDayData = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    const report = getDailyReport(dateStr);
    return report;
  };

  // Calculate monthly stats
  const monthlyStats = useMemo(() => {
    return calculateMonthlyReport(currentMonth + 1, currentYear);
  }, [currentMonth, currentYear, calculateMonthlyReport]);

  // Get progress color based on percentage
  const getProgressColor = (percent: number) => {
    if (percent >= 80) return "bg-green-500";
    if (percent >= 50) return "bg-yellow-500";
    if (percent >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  // Navigate months
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Check if date is today
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  // Check if date is selected
  const isSelected = (date: Date) => {
    return selectedDate?.toDateString() === date.toDateString();
  };

  // Save today's report
  const saveCurrentDayReport = () => {
    const dateStr = today.toISOString().split("T")[0];
    const waterTracker = dailyTrackers.find((t) => t.name === "Water Intake");
    const sleepTracker = dailyTrackers.find((t) => t.name === "Sleep Hours");
    
    const completedTasks = 
      exercises.filter((e) => e.completedSets >= e.sets).length +
      studyTasks.filter((t) => t.completed).length +
      japaneseTasks.filter((t) => t.completed).length;
    
    const totalTasks = exercises.length + studyTasks.length + japaneseTasks.length;

    saveDailyReport({
      date: dateStr,
      exercisePercent: getExercisePercentage(),
      studyPercent: getStudyPercentage(),
      japanesePercent: getJapanesePercentage(),
      overallPercent: getOverallPercentage(),
      waterGlasses: waterTracker?.completed || 0,
      sleepHours: sleepTracker?.completed || 0,
      tasksCompleted: completedTasks,
      totalTasks,
    });
  };

  // Current percentages
  const exercisePercent = getExercisePercentage();
  const studyPercent = getStudyPercentage();
  const japanesePercent = getJapanesePercentage();
  const overallPercent = getOverallPercentage();

  // Selected date data
  const selectedDateData = selectedDate
    ? isToday(selectedDate)
      ? {
          exercisePercent,
          studyPercent,
          japanesePercent,
          overallPercent,
          isLive: true,
        }
      : { ...getDayData(selectedDate), isLive: false }
    : null;

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#6d28d9,transparent_35%),radial-gradient(circle_at_bottom_left,#06b6d4,transparent_35%)] opacity-30" />
      <div className="absolute inset-0 backdrop-blur-3xl" />

      <div className="relative z-10 px-6 md:px-10 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent flex items-center gap-3">
              <Calendar className="h-10 w-10 text-cyan-400" />
              Progress Calendar
            </h1>
            <p className="text-gray-300 mt-2 text-lg">
              Track daily and monthly achievements
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <button
              onClick={saveCurrentDayReport}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 px-4 py-2 rounded-xl font-medium hover:opacity-90 transition flex items-center gap-2"
            >
              <Trophy className="h-4 w-4" />
              Save Today&apos;s Progress
            </button>
            <button
              onClick={() => setEditMode(!editMode)}
              className={`px-4 py-2 rounded-xl font-medium transition flex items-center gap-2 ${
                editMode
                  ? "bg-green-500 text-white"
                  : "bg-white/10 border border-white/10 hover:bg-white/20"
              }`}
            >
              <Edit3 className="h-4 w-4" />
              {editMode ? "Done Editing" : "Edit Mode"}
            </button>
          </div>
        </motion.div>

        {/* Monthly Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-5 gap-4 mb-8"
        >
          <div className="bg-white/10 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <span className="text-sm text-gray-400">Month Avg</span>
            </div>
            <p className="text-3xl font-black">{monthlyStats.avgOverall}%</p>
          </div>
          <div className="bg-white/10 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-2">
              <Dumbbell className="h-5 w-5 text-pink-400" />
              <span className="text-sm text-gray-400">Exercise Avg</span>
            </div>
            <p className="text-3xl font-black">{monthlyStats.avgExercise}%</p>
          </div>
          <div className="bg-white/10 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-2">
              <Code2 className="h-5 w-5 text-purple-400" />
              <span className="text-sm text-gray-400">IT Study Avg</span>
            </div>
            <p className="text-3xl font-black">{monthlyStats.avgStudy}%</p>
          </div>
          <div className="bg-white/10 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-cyan-400" />
              <span className="text-sm text-gray-400">Japanese Avg</span>
            </div>
            <p className="text-3xl font-black">{monthlyStats.avgJapanese}%</p>
          </div>
          <div className="bg-white/10 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-yellow-400" />
              <span className="text-sm text-gray-400">Perfect Days</span>
            </div>
            <p className="text-3xl font-black">{monthlyStats.perfectDays}</p>
            <p className="text-xs text-gray-400">of {monthlyStats.totalDays} tracked</p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={prevMonth}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h2 className="text-2xl font-bold">
                  {monthNames[currentMonth]} {currentYear}
                </h2>
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Week Days Header */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-gray-400 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="aspect-square" />;
                  }

                  const dayData = getDayData(date);
                  const isTodayDate = isToday(date);
                  const isSelectedDate = isSelected(date);
                  const isPast = date < today && !isTodayDate;
                  const isFuture = date > today;

                  // For today, use live data
                  const percent = isTodayDate
                    ? overallPercent
                    : dayData?.overallPercent || 0;

                  return (
                    <motion.button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`aspect-square rounded-xl p-2 flex flex-col items-center justify-center relative transition-all ${
                        isSelectedDate
                          ? "bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border-2 border-cyan-400"
                          : isTodayDate
                          ? "bg-cyan-500/20 border border-cyan-400/50"
                          : isPast && dayData
                          ? "bg-white/10 border border-white/10"
                          : isFuture
                          ? "bg-white/5 border border-white/5 opacity-50"
                          : "bg-white/5 border border-white/5"
                      }`}
                    >
                      <span
                        className={`text-sm font-medium ${
                          isTodayDate ? "text-cyan-400" : ""
                        }`}
                      >
                        {date.getDate()}
                      </span>
                      {(dayData || isTodayDate) && !isFuture && (
                        <div className="mt-1 flex flex-col items-center gap-1">
                          <div
                            className={`h-1.5 w-8 rounded-full ${getProgressColor(percent)}`}
                          />
                          <span className="text-[10px] text-gray-400">
                            {percent}%
                          </span>
                        </div>
                      )}
                      {percent >= 90 && !isFuture && (dayData || isTodayDate) && (
                        <Star className="absolute top-1 right-1 h-3 w-3 text-yellow-400" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span>80%+</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <span>50-79%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-orange-500" />
                  <span>25-49%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span>{"<25%"}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Day Details Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Selected Date Info */}
            <AnimatePresence mode="wait">
              {selectedDate && (
                <motion.div
                  key={selectedDate.toISOString()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">
                      {isToday(selectedDate) ? "Today" : selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                    </h3>
                    {selectedDateData?.isLive && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                        Live
                      </span>
                    )}
                  </div>

                  {/* Overall Progress Circle */}
                  <div className="flex justify-center mb-6">
                    <div className="relative h-32 w-32">
                      <svg className="h-32 w-32 -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="10"
                          fill="none"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="url(#progressGradient)"
                          strokeWidth="10"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${(selectedDateData?.overallPercent || 0) * 3.52} 352`}
                        />
                        <defs>
                          <linearGradient
                            id="progressGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop offset="0%" stopColor="#06b6d4" />
                            <stop offset="50%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black">
                          {selectedDateData?.overallPercent || 0}%
                        </span>
                        <span className="text-xs text-gray-400">Overall</span>
                      </div>
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  <div className="space-y-3">
                    <ProgressItem
                      icon={Dumbbell}
                      label="Exercise"
                      value={selectedDateData?.exercisePercent || 0}
                      color="from-pink-500 to-red-500"
                    />
                    <ProgressItem
                      icon={Code2}
                      label="IT Study"
                      value={selectedDateData?.studyPercent || 0}
                      color="from-purple-500 to-indigo-500"
                    />
                    <ProgressItem
                      icon={BookOpen}
                      label="Japanese"
                      value={selectedDateData?.japanesePercent || 0}
                      color="from-cyan-500 to-blue-500"
                    />
                  </div>

                  {/* Achievements */}
                  {(selectedDateData?.overallPercent || 0) >= 50 && (
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <h4 className="text-sm font-medium text-gray-400 mb-3">
                        Achievements
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {(selectedDateData?.overallPercent || 0) >= 90 && (
                          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium flex items-center gap-1">
                            <Trophy className="h-3 w-3" /> Perfect Day
                          </span>
                        )}
                        {(selectedDateData?.exercisePercent || 0) >= 100 && (
                          <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-xs font-medium flex items-center gap-1">
                            <Dumbbell className="h-3 w-3" /> Workout Complete
                          </span>
                        )}
                        {(selectedDateData?.studyPercent || 0) >= 100 && (
                          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium flex items-center gap-1">
                            <Code2 className="h-3 w-3" /> Code Master
                          </span>
                        )}
                        {(selectedDateData?.japanesePercent || 0) >= 100 && (
                          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-medium flex items-center gap-1">
                            <BookOpen className="h-3 w-3" /> Language Pro
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Edit Panel (only for today) */}
            {editMode && selectedDate && isToday(selectedDate) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
              >
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Edit3 className="h-5 w-5 text-cyan-400" />
                  Quick Edit
                </h3>

                {/* Daily Trackers */}
                <div className="space-y-3 mb-6">
                  <h4 className="text-sm font-medium text-gray-400">
                    Daily Trackers
                  </h4>
                  {dailyTrackers.map((tracker) => {
                    const IconComp = trackerIcons[tracker.icon] || Target;
                    const percent = Math.min(
                      (tracker.completed / tracker.target) * 100,
                      100
                    );
                    return (
                      <div
                        key={tracker.id}
                        className="bg-white/5 border border-white/10 rounded-xl p-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <IconComp className="h-4 w-4 text-cyan-400" />
                            <span className="text-sm">{tracker.name}</span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {tracker.completed}/{tracker.target} {tracker.unit}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => decrementTracker(tracker.id)}
                            className="p-1.5 rounded bg-white/10 hover:bg-white/20"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                percent >= 100
                                  ? "bg-green-500"
                                  : "bg-gradient-to-r from-cyan-500 to-purple-500"
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <button
                            onClick={() => incrementTracker(tracker.id)}
                            className="p-1.5 rounded bg-white/10 hover:bg-white/20"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Task Toggles */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-400">
                    Quick Tasks
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {studyTasks.slice(0, 3).map((task) => (
                      <button
                        key={task.id}
                        onClick={() => toggleStudyTask(task.id)}
                        className={`flex items-center gap-2 p-2 rounded-lg text-sm transition ${
                          task.completed
                            ? "bg-green-500/20 text-green-400"
                            : "bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        {task.completed ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Code2 className="h-4 w-4 text-purple-400" />
                        )}
                        <span className={task.completed ? "line-through" : ""}>
                          {task.name}
                        </span>
                      </button>
                    ))}
                    {japaneseTasks.slice(0, 3).map((task) => (
                      <button
                        key={task.id}
                        onClick={() => toggleJapaneseTask(task.id)}
                        className={`flex items-center gap-2 p-2 rounded-lg text-sm transition ${
                          task.completed
                            ? "bg-green-500/20 text-green-400"
                            : "bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        {task.completed ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <BookOpen className="h-4 w-4 text-cyan-400" />
                        )}
                        <span className={task.completed ? "line-through" : ""}>
                          {task.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}

// Progress Item Component
function ProgressItem({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 text-gray-400" />
      <div className="flex-1">
        <div className="flex justify-between text-sm mb-1">
          <span>{label}</span>
          <span className={value >= 100 ? "text-green-400" : ""}>{value}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${color}`}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    </div>
  );
}
