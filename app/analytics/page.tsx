"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Flame,
  Target,
  Award,
  Clock,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useHistoryStore, DailyReport } from "@/store/useHistoryStore";
import { useAppStore } from "@/store/useAppStore";
import { useGoalStore } from "@/store/useGoalStore";

type TimeRange = "week" | "month" | "year";

export default function AnalyticsPage() {
  const { dailyReports } = useHistoryStore();
  const { focusSessions } = useAppStore();
  const { goals } = useGoalStore();
  const [timeRange, setTimeRange] = useState<TimeRange>("week");

  // Use dailyReports directly instead of reports getter
  const reports = dailyReports || [];

  // Get date range based on selection
  const getDateRange = () => {
    const now = new Date();
    const start = new Date();
    switch (timeRange) {
      case "week":
        start.setDate(now.getDate() - 7);
        break;
      case "month":
        start.setMonth(now.getMonth() - 1);
        break;
      case "year":
        start.setFullYear(now.getFullYear() - 1);
        break;
    }
    return { start, end: now };
  };

  // Filter reports by date range
  const filteredReports = useMemo(() => {
    const { start, end } = getDateRange();
    return reports.filter((r) => {
      const date = new Date(r.date);
      return date >= start && date <= end;
    });
  }, [reports, timeRange]);

  // Calculate stats
  const stats = useMemo(() => {
    if (filteredReports.length === 0) {
      return {
        avgOverall: 0,
        avgExercise: 0,
        avgStudy: 0,
        avgJapanese: 0,
        totalDays: 0,
        streakDays: 0,
        perfectDays: 0,
      };
    }

    const totalDays = filteredReports.length;
    const avgOverall = Math.round(
      filteredReports.reduce((acc, r) => acc + r.overallProgress, 0) / totalDays
    );
    const avgExercise = Math.round(
      filteredReports.reduce((acc, r) => acc + r.exerciseProgress, 0) / totalDays
    );
    const avgStudy = Math.round(
      filteredReports.reduce((acc, r) => acc + r.studyProgress, 0) / totalDays
    );
    const avgJapanese = Math.round(
      filteredReports.reduce((acc, r) => acc + r.japaneseProgress, 0) / totalDays
    );
    const perfectDays = filteredReports.filter((r) => r.overallProgress >= 90).length;

    // Calculate streak
    let streakDays = 0;
    const sortedReports = [...filteredReports].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    for (const report of sortedReports) {
      if (report.overallProgress >= 50) {
        streakDays++;
      } else {
        break;
      }
    }

    return {
      avgOverall,
      avgExercise,
      avgStudy,
      avgJapanese,
      totalDays,
      streakDays,
      perfectDays,
    };
  }, [filteredReports]);

  // Chart data
  const progressChartData = useMemo(() => {
    return filteredReports.slice(-14).map((r) => ({
      date: new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      overall: r.overallProgress,
      exercise: r.exerciseProgress,
      study: r.studyProgress,
      japanese: r.japaneseProgress,
    }));
  }, [filteredReports]);

  const categoryData = useMemo(() => [
    { name: "Exercise", value: stats.avgExercise, color: "#ec4899" },
    { name: "IT Study", value: stats.avgStudy, color: "#8b5cf6" },
    { name: "Japanese", value: stats.avgJapanese, color: "#06b6d4" },
  ], [stats]);

  // Heatmap data (last 12 weeks)
  const heatmapData = useMemo(() => {
    const weeks: { date: string; value: number }[][] = [];
    const now = new Date();
    
    for (let w = 11; w >= 0; w--) {
      const week: { date: string; value: number }[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(now);
        date.setDate(date.getDate() - (w * 7 + (6 - d)));
        const dateStr = date.toISOString().split("T")[0];
        const report = reports.find((r) => r.date === dateStr);
        week.push({
          date: dateStr,
          value: report?.overallProgress || 0,
        });
      }
      weeks.push(week);
    }
    return weeks;
  }, [reports]);

  const getHeatmapColor = (value: number) => {
    if (value === 0) return "bg-white/5";
    if (value < 25) return "bg-red-500/30";
    if (value < 50) return "bg-orange-500/40";
    if (value < 75) return "bg-yellow-500/50";
    if (value < 90) return "bg-green-500/60";
    return "bg-green-400";
  };

  // Focus time by category
  const focusByCategory = useMemo(() => {
    const categories: Record<string, number> = {};
    focusSessions.forEach((s) => {
      categories[s.category] = (categories[s.category] || 0) + s.duration;
    });
    return Object.entries(categories).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: name === "skills" ? "#8b5cf6" : name === "japanese" ? "#06b6d4" : name === "health" ? "#ec4899" : "#22c55e",
    }));
  }, [focusSessions]);

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#6d28d9,transparent_35%),radial-gradient(circle_at_bottom_left,#06b6d4,transparent_35%)] opacity-30" />
      <div className="absolute inset-0 backdrop-blur-3xl" />

      <div className="relative z-10 px-6 md:px-10 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black">Analytics</h1>
              <p className="text-gray-400">Track your progress and performance</p>
            </div>
          </div>
          {/* Time Range Selector */}
          <div className="flex gap-2">
            {(["week", "month", "year"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-xl font-medium capitalize transition ${
                  timeRange === range
                    ? "bg-cyan-500 text-white"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-2xl p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Avg Progress</span>
            </div>
            <div className="text-3xl font-black text-cyan-400">{stats.avgOverall}%</div>
          </div>
          <div className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-2xl p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Flame className="h-4 w-4" />
              <span className="text-sm">Current Streak</span>
            </div>
            <div className="text-3xl font-black text-orange-400">{stats.streakDays} days</div>
          </div>
          <div className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-2xl p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Award className="h-4 w-4" />
              <span className="text-sm">Perfect Days</span>
            </div>
            <div className="text-3xl font-black text-green-400">{stats.perfectDays}</div>
          </div>
          <div className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-2xl p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Days Tracked</span>
            </div>
            <div className="text-3xl font-black text-purple-400">{stats.totalDays}</div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Progress Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-white/10 border border-white/10 backdrop-blur-xl rounded-3xl p-6"
          >
            <h2 className="text-xl font-bold mb-4">Progress Over Time</h2>
            {progressChartData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="overall"
                      stroke="#06b6d4"
                      strokeWidth={3}
                      dot={false}
                      name="Overall"
                    />
                    <Line
                      type="monotone"
                      dataKey="exercise"
                      stroke="#ec4899"
                      strokeWidth={2}
                      dot={false}
                      name="Exercise"
                    />
                    <Line
                      type="monotone"
                      dataKey="study"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={false}
                      name="IT Study"
                    />
                    <Line
                      type="monotone"
                      dataKey="japanese"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={false}
                      name="Japanese"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                No data available for this period
              </div>
            )}
          </motion.div>

          {/* Category Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-3xl p-6"
          >
            <h2 className="text-xl font-bold mb-4">Category Average</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                    }}
                    formatter={(value: number) => [`${value}%`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm">{cat.name}</span>
                  </div>
                  <span className="font-bold">{cat.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Activity Heatmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white/10 border border-white/10 backdrop-blur-xl rounded-3xl p-6"
          >
            <h2 className="text-xl font-bold mb-4">Activity Heatmap (12 weeks)</h2>
            <div className="overflow-x-auto">
              <div className="flex gap-1 min-w-max">
                {heatmapData.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day, dayIndex) => (
                      <div
                        key={day.date}
                        className={`w-4 h-4 rounded-sm ${getHeatmapColor(day.value)} transition-colors`}
                        title={`${day.date}: ${day.value}%`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
              <span>Less</span>
              <div className="w-3 h-3 rounded-sm bg-white/5" />
              <div className="w-3 h-3 rounded-sm bg-red-500/30" />
              <div className="w-3 h-3 rounded-sm bg-orange-500/40" />
              <div className="w-3 h-3 rounded-sm bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-sm bg-green-500/60" />
              <div className="w-3 h-3 rounded-sm bg-green-400" />
              <span>More</span>
            </div>
          </motion.div>

          {/* Focus Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-3xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-5 w-5 text-yellow-400" />
              <h2 className="text-xl font-bold">Focus Time</h2>
            </div>
            {focusByCategory.length > 0 ? (
              <>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={focusByCategory} layout="vertical">
                      <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                      <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} width={70} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "12px",
                        }}
                        formatter={(value: number) => [`${value} min`, ""]}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {focusByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mt-4">
                  <div className="text-2xl font-black text-cyan-400">
                    {Math.round(focusByCategory.reduce((acc, c) => acc + c.value, 0) / 60)}h
                  </div>
                  <div className="text-sm text-gray-400">Total Focus Time</div>
                </div>
              </>
            ) : (
              <div className="h-40 flex items-center justify-center text-gray-400">
                No focus sessions recorded
              </div>
            )}
          </motion.div>

          {/* Goals Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-3 bg-white/10 border border-white/10 backdrop-blur-xl rounded-3xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-5 w-5 text-green-400" />
              <h2 className="text-xl font-bold">Goals Progress</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {goals.slice(0, 3).map((goal) => (
                <div key={goal.id} className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{goal.title}</span>
                    <span
                      className={`text-sm font-bold ${
                        goal.progress >= 75
                          ? "text-green-400"
                          : goal.progress >= 50
                          ? "text-yellow-400"
                          : "text-orange-400"
                      }`}
                    >
                      {goal.progress}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        goal.progress >= 75
                          ? "bg-green-500"
                          : goal.progress >= 50
                          ? "bg-yellow-500"
                          : "bg-orange-500"
                      }`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                    <span className="capitalize">{goal.category}</span>
                    <span>Target: {goal.targetDate}</span>
                  </div>
                </div>
              ))}
              {goals.length === 0 && (
                <div className="col-span-3 text-center py-8 text-gray-400">
                  No goals set yet
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
