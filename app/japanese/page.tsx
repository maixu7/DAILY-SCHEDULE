"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Languages,
  BookOpen,
  Headphones,
  MessageCircle,
  PenTool,
  Trophy,
  Flame,
  Target,
  ChevronRight,
  Star,
  Check,
  X,
  Plus,
  Trash2,
  Minus,
  Clock,
} from "lucide-react";
import { useDailyStore } from "@/store/useDailyStore";

interface ReadingItem {
  id: string;
  title: string;
  type: "article" | "manga" | "book" | "news";
  completed: boolean;
}

export default function JapanesePage() {
  const {
    japaneseTasks,
    updateJapaneseTask,
    toggleJapaneseTask,
    addJapaneseTask,
    getJapanesePercentage,
  } = useDailyStore();

  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    name: "",
    targetMinutes: 20,
    category: "vocabulary" as const,
  });

  // Reading list state
  const [readingList, setReadingList] = useState<ReadingItem[]>([
    { id: "1", title: "NHK News Easy - Weather Article", type: "news", completed: false },
    { id: "2", title: "Spy x Family Ch. 45", type: "manga", completed: false },
    { id: "3", title: "Business Email Templates", type: "article", completed: true },
    { id: "4", title: "JLPT N2 Reading Practice #12", type: "book", completed: false },
  ]);
  const [newReadingTitle, setNewReadingTitle] = useState("");
  const [newReadingType, setNewReadingType] = useState<ReadingItem["type"]>("article");

  const japanesePercent = getJapanesePercentage();

  const handleAddTask = () => {
    if (newTask.name.trim()) {
      addJapaneseTask({
        name: newTask.name,
        description: `Study ${newTask.name}`,
        targetMinutes: newTask.targetMinutes,
        completedMinutes: 0,
        category: newTask.category,
        completed: false,
        level: "N3",
        resources: [],
      });
      setNewTask({ name: "", targetMinutes: 20, category: "vocabulary" });
      setShowAddTask(false);
    }
  };

  const toggleReading = (id: string) => {
    setReadingList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const addReading = () => {
    if (!newReadingTitle.trim()) return;
    setReadingList((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: newReadingTitle,
        type: newReadingType,
        completed: false,
      },
    ]);
    setNewReadingTitle("");
  };

  const removeReading = (id: string) => {
    setReadingList((prev) => prev.filter((item) => item.id !== id));
  };

  const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    vocabulary: BookOpen,
    speaking: MessageCircle,
    keigo: Languages,
    reading: BookOpen,
    listening: Headphones,
    grammar: PenTool,
  };

  const categoryColors: Record<string, string> = {
    vocabulary: "from-cyan-500 to-blue-500",
    speaking: "from-purple-500 to-indigo-500",
    keigo: "from-pink-500 to-rose-500",
    reading: "from-green-500 to-emerald-500",
    listening: "from-orange-500 to-yellow-500",
    grammar: "from-red-500 to-pink-500",
  };

  const skills = [
    { name: "Reading", level: 85, icon: BookOpen, color: "from-pink-500 to-rose-500", key: "reading" },
    { name: "Listening", level: 78, icon: Headphones, color: "from-cyan-500 to-blue-500", key: "listening" },
    { name: "Speaking", level: 65, icon: MessageCircle, color: "from-purple-500 to-indigo-500", key: "speaking" },
    { name: "Writing", level: 72, icon: PenTool, color: "from-green-500 to-emerald-500", key: "writing" },
  ];

  const kanjiProgress = [
    { level: "N5", total: 100, learned: 100 },
    { level: "N4", total: 200, learned: 200 },
    { level: "N3", total: 350, learned: 350 },
    { level: "N2", total: 450, learned: 380 },
    { level: "N1", total: 600, learned: 120 },
  ];

  const getTypeColor = (type: ReadingItem["type"]) => {
    switch (type) {
      case "article":
        return "bg-cyan-500/20 text-cyan-400";
      case "manga":
        return "bg-pink-500/20 text-pink-400";
      case "book":
        return "bg-purple-500/20 text-purple-400";
      case "news":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-white/20 text-white";
    }
  };

  const completedTasks = japaneseTasks.filter((t) => t.completed).length;
  const totalMinutesTarget = japaneseTasks.reduce((acc, t) => acc + t.targetMinutes, 0);
  const totalMinutesCompleted = japaneseTasks.reduce((acc, t) => acc + t.completedMinutes, 0);

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#ec4899,transparent_40%),radial-gradient(circle_at_bottom_left,#8b5cf6,transparent_40%)] opacity-20" />
      <div className="absolute inset-0 backdrop-blur-3xl" />

      <div className="relative z-10 px-6 md:px-10 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500">
                <Languages className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black">Japanese Mastery</h1>
                <p className="text-gray-400">JLPT N2 Journey - 45 day streak</p>
              </div>
            </div>
            {/* Overall Progress Circle */}
            <div className="relative h-24 w-24">
              <svg className="h-24 w-24 -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="url(#japaneseGradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${japanesePercent * 2.51} 251`}
                />
                <defs>
                  <linearGradient id="japaneseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black">{japanesePercent}%</span>
                <span className="text-xs text-gray-400">Complete</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Tasks Done", value: `${completedTasks}/${japaneseTasks.length}`, icon: Target },
            { label: "Time Spent", value: `${totalMinutesCompleted} min`, icon: Clock },
            { label: "Study Streak", value: "45 days", icon: Flame },
            { label: "JLPT Level", value: "N2 Ready", icon: Trophy },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/10 border border-white/10 rounded-2xl p-5 backdrop-blur-xl"
            >
              <stat.icon className="h-6 w-6 text-pink-400 mb-3" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Study Tasks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Target className="text-pink-400" />
                  {"Today's Japanese Study"}
                </h2>
                <button
                  onClick={() => setShowAddTask(!showAddTask)}
                  className="p-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90 transition"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              {showAddTask && (
                <div className="grid md:grid-cols-4 gap-4 mb-6 p-4 bg-white/5 rounded-2xl">
                  <input
                    type="text"
                    placeholder="Task name..."
                    value={newTask.name}
                    onChange={(e) => setNewTask((p) => ({ ...p, name: e.target.value }))}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-pink-400 outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Minutes"
                    value={newTask.targetMinutes}
                    onChange={(e) =>
                      setNewTask((p) => ({ ...p, targetMinutes: parseInt(e.target.value) || 0 }))
                    }
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-pink-400 outline-none"
                  />
                  <select
                    value={newTask.category}
                    onChange={(e) =>
                      setNewTask((p) => ({ ...p, category: e.target.value as typeof newTask.category }))
                    }
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-pink-400 outline-none"
                  >
                    <option value="vocabulary">Vocabulary</option>
                    <option value="speaking">Speaking</option>
                    <option value="keigo">Keigo/Business</option>
                    <option value="reading">Reading</option>
                    <option value="listening">Listening</option>
                    <option value="grammar">Grammar</option>
                  </select>
                  <button
                    onClick={handleAddTask}
                    className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl px-4 py-3 font-medium hover:opacity-90 transition"
                  >
                    Add Task
                  </button>
                </div>
              )}

              <div className="space-y-4">
                {japaneseTasks.map((task) => {
                  const Icon = categoryIcons[task.category] || BookOpen;
                  const percent = Math.min(
                    (task.completedMinutes / task.targetMinutes) * 100,
                    100
                  );

                  return (
                    <div
                      key={task.id}
                      className={`border rounded-2xl p-4 transition-all ${
                        task.completed
                          ? "bg-green-500/10 border-green-500/30"
                          : "bg-white/5 border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => toggleJapaneseTask(task.id)}
                          className={`p-3 rounded-xl transition-all ${
                            task.completed
                              ? "bg-green-500"
                              : `bg-gradient-to-br ${categoryColors[task.category]}`
                          }`}
                        >
                          {task.completed ? (
                            <Check className="h-5 w-5 text-white" />
                          ) : (
                            <Icon className="h-5 w-5 text-white" />
                          )}
                        </button>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`font-medium ${
                                task.completed ? "text-gray-400 line-through" : ""
                              }`}
                            >
                              {task.name}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-white/10 uppercase">
                              {task.category}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                updateJapaneseTask(
                                  task.id,
                                  Math.max(0, task.completedMinutes - 5)
                                )
                              }
                              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <div className="flex-1">
                              <div className="flex justify-between text-xs mb-1">
                                <span>
                                  {task.completedMinutes}/{task.targetMinutes} min
                                </span>
                                <span
                                  className={task.completed ? "text-green-400" : ""}
                                >
                                  {Math.round(percent)}%
                                </span>
                              </div>
                              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percent}%` }}
                                  className={`h-full rounded-full ${
                                    task.completed
                                      ? "bg-green-500"
                                      : `bg-gradient-to-r ${categoryColors[task.category]}`
                                  }`}
                                />
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                updateJapaneseTask(task.id, task.completedMinutes + 5)
                              }
                              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <div className="mt-2 flex justify-between text-xs text-gray-400">
                            <span>
                              Remaining: {Math.max(0, task.targetMinutes - task.completedMinutes)} min
                            </span>
                            <span>
                              {task.completed
                                ? "COMPLETED"
                                : `${task.targetMinutes - task.completedMinutes} min to go`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Reading Tracker */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <BookOpen className="text-cyan-400" />
                Reading Tracker
              </h2>

              {/* Add new reading item */}
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newReadingTitle}
                  onChange={(e) => setNewReadingTitle(e.target.value)}
                  placeholder="Add reading material..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50"
                  onKeyDown={(e) => e.key === "Enter" && addReading()}
                />
                <select
                  value={newReadingType}
                  onChange={(e) => setNewReadingType(e.target.value as ReadingItem["type"])}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="article">Article</option>
                  <option value="manga">Manga</option>
                  <option value="book">Book</option>
                  <option value="news">News</option>
                </select>
                <button
                  onClick={addReading}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl px-4 py-3 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              {/* Reading list */}
              <div className="space-y-3">
                {readingList.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                      item.completed
                        ? "bg-green-500/20 border-green-500/30"
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    <button
                      onClick={() => toggleReading(item.id)}
                      className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        item.completed
                          ? "bg-green-500"
                          : "border-2 border-white/30 hover:border-cyan-400"
                      }`}
                    >
                      {item.completed ? (
                        <Check className="h-5 w-5 text-white" />
                      ) : (
                        <X className="h-4 w-4 text-white/30" />
                      )}
                    </button>
                    <div className="flex-1">
                      <p className={`font-medium ${item.completed ? "line-through text-gray-400" : ""}`}>
                        {item.title}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-lg ${getTypeColor(item.type)}`}>
                      {item.type}
                    </span>
                    <button
                      onClick={() => removeReading(item.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Reading stats */}
              <div className="mt-6 pt-6 border-t border-white/10 flex justify-between text-sm">
                <span className="text-gray-400">
                  Completed: {readingList.filter((r) => r.completed).length}/{readingList.length}
                </span>
                <span className="text-cyan-400">
                  {Math.round((readingList.filter((r) => r.completed).length / Math.max(readingList.length, 1)) * 100)}% done today
                </span>
              </div>
            </motion.div>

            {/* Skills Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
            >
              <h2 className="text-xl font-bold mb-6">Skills Level</h2>
              <div className="grid grid-cols-2 gap-4">
                {skills.map((skill, i) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${skill.color}`}>
                        <skill.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold">{skill.name}</h3>
                        <p className="text-sm text-gray-400">Level {skill.level}%</p>
                      </div>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Kanji Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <PenTool className="text-pink-400" />
                Kanji Progress by JLPT Level
              </h2>
              <div className="space-y-4">
                {kanjiProgress.map((level) => {
                  const percent = Math.round((level.learned / level.total) * 100);
                  return (
                    <div key={level.level}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{level.level}</span>
                        <span className="text-gray-400">
                          {level.learned}/{level.total} kanji ({percent}%)
                        </span>
                      </div>
                      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 1 }}
                          className={`h-full rounded-full ${
                            level.learned === level.total
                              ? "bg-gradient-to-r from-green-500 to-emerald-500"
                              : "bg-gradient-to-r from-pink-500 to-rose-500"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Trophy className="text-yellow-400" />
                {"Today's Summary"}
              </h2>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex justify-between mb-2">
                    <span>Tasks Completed</span>
                    <span className="text-pink-400">
                      {completedTasks}/{japaneseTasks.length}
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                      style={{
                        width: `${(completedTasks / japaneseTasks.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex justify-between mb-2">
                    <span>Time Progress</span>
                    <span className="text-purple-400">
                      {totalMinutesCompleted}/{totalMinutesTarget} min
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      style={{
                        width: `${Math.min(
                          (totalMinutesCompleted / totalMinutesTarget) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Study Resources */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
            >
              <h2 className="text-xl font-bold mb-4">Study Resources</h2>
              <div className="space-y-3">
                {[
                  { name: "Anki Flashcards", desc: "Vocabulary review" },
                  { name: "NHK News Easy", desc: "Reading practice" },
                  { name: "JapanesePod101", desc: "Listening immersion" },
                  { name: "iTalki", desc: "Speaking practice" },
                ].map((resource) => (
                  <div
                    key={resource.name}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer"
                  >
                    <BookOpen className="h-4 w-4 text-pink-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{resource.name}</p>
                      <p className="text-xs text-gray-400">{resource.desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Daily Goals */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Star className="text-yellow-400" />
                Daily Goals
              </h2>
              <div className="space-y-3">
                {[
                  { goal: "Learn 20 new words", done: true },
                  { goal: "30 min speaking", done: false },
                  { goal: "Read 1 article", done: true },
                  { goal: "1 hour immersion", done: false },
                ].map((item) => (
                  <div
                    key={item.goal}
                    className={`flex items-center gap-3 p-3 rounded-xl ${
                      item.done
                        ? "bg-green-500/10 border border-green-500/20"
                        : "bg-white/5 border border-white/10"
                    }`}
                  >
                    <div
                      className={`h-5 w-5 rounded-full flex items-center justify-center ${
                        item.done ? "bg-green-500" : "border-2 border-white/30"
                      }`}
                    >
                      {item.done && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span className={item.done ? "text-gray-400 line-through" : ""}>
                      {item.goal}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
