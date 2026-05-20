"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Code,
  Terminal,
  Database,
  Cloud,
  Globe,
  GitBranch,
  Trophy,
  Target,
  ChevronRight,
  Star,
  Layers,
  Server,
  Check,
  Plus,
  Minus,
  Clock,
  X,
  Play,
  Pause,
} from "lucide-react";
import { useDailyStore } from "@/store/useDailyStore";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  html: Globe,
  css: Layers,
  javascript: Code,
  python: Terminal,
  java: Server,
  git: GitBranch,
  aws: Cloud,
};

const categoryColors: Record<string, string> = {
  html: "from-orange-500 to-red-500",
  css: "from-blue-500 to-cyan-500",
  javascript: "from-yellow-500 to-orange-500",
  python: "from-blue-600 to-green-500",
  java: "from-red-600 to-orange-500",
  git: "from-orange-600 to-red-500",
  aws: "from-orange-500 to-yellow-500",
};

export default function SkillsPage() {
  const {
    studyTasks,
    updateStudyTask,
    toggleStudyTask,
    addStudyTask,
    getStudyPercentage,
  } = useDailyStore();

  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    name: "",
    targetMinutes: 30,
    category: "html" as const,
  });

  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);

  const studyPercent = getStudyPercentage();

  const handleAddTask = () => {
    if (newTask.name.trim()) {
      addStudyTask({
        name: newTask.name,
        description: `Study ${newTask.name}`,
        targetMinutes: newTask.targetMinutes,
        completedMinutes: 0,
        category: newTask.category,
        completed: false,
        resources: [],
      });
      setNewTask({ name: "", targetMinutes: 30, category: "html" });
      setShowAddTask(false);
    }
  };

  const frontendSkills = [
    { name: "HTML", level: 90, color: "from-orange-500 to-red-500" },
    { name: "CSS", level: 75, color: "from-blue-500 to-cyan-500" },
    { name: "JavaScript", level: 45, color: "from-yellow-500 to-orange-500" },
    { name: "TypeScript", level: 30, color: "from-blue-600 to-blue-400" },
    { name: "React", level: 25, color: "from-cyan-500 to-blue-500" },
  ];

  const backendSkills = [
    { name: "Node.js", level: 20, color: "from-green-600 to-green-400" },
    { name: "Python", level: 30, color: "from-yellow-500 to-blue-500" },
    { name: "SQL", level: 35, color: "from-blue-500 to-purple-500" },
    { name: "REST APIs", level: 25, color: "from-purple-500 to-pink-500" },
  ];

  const completedTasks = studyTasks.filter((t) => t.completed).length;
  const totalMinutesTarget = studyTasks.reduce((acc, t) => acc + t.targetMinutes, 0);
  const totalMinutesCompleted = studyTasks.reduce((acc, t) => acc + t.completedMinutes, 0);

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#06b6d4,transparent_40%),radial-gradient(circle_at_bottom_left,#8b5cf6,transparent_40%)] opacity-20" />
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
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black">IT Skills</h1>
                <p className="text-gray-400">Full-Stack Development Journey</p>
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
                  stroke="url(#skillGradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${studyPercent * 2.51} 251`}
                />
                <defs>
                  <linearGradient id="skillGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black">{studyPercent}%</span>
                <span className="text-xs text-gray-400">Complete</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Tasks Done", value: `${completedTasks}/${studyTasks.length}`, icon: Target },
            { label: "Time Spent", value: `${totalMinutesCompleted} min`, icon: Clock },
            { label: "Target Time", value: `${totalMinutesTarget} min`, icon: Trophy },
            { label: "Completion", value: `${studyPercent}%`, icon: Star },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/10 border border-white/10 rounded-2xl p-5 backdrop-blur-xl"
            >
              <stat.icon className="h-6 w-6 text-cyan-400 mb-3" />
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
                  <Target className="text-cyan-400" />
                  {"Today's Study Tasks"}
                </h2>
                <button
                  onClick={() => setShowAddTask(!showAddTask)}
                  className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 transition"
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
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-400 outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Minutes"
                    value={newTask.targetMinutes}
                    onChange={(e) =>
                      setNewTask((p) => ({ ...p, targetMinutes: parseInt(e.target.value) || 0 }))
                    }
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-400 outline-none"
                  />
                  <select
                    value={newTask.category}
                    onChange={(e) =>
                      setNewTask((p) => ({ ...p, category: e.target.value as typeof newTask.category }))
                    }
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-400 outline-none"
                  >
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="git">Git</option>
                    <option value="aws">AWS</option>
                  </select>
                  <button
                    onClick={handleAddTask}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl px-4 py-3 font-medium hover:opacity-90 transition"
                  >
                    Add Task
                  </button>
                </div>
              )}

              <div className="space-y-4">
                {studyTasks.map((task) => {
                  const Icon = categoryIcons[task.category] || Code;
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
                          onClick={() => toggleStudyTask(task.id)}
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
                                updateStudyTask(
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
                                updateStudyTask(task.id, task.completedMinutes + 5)
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

            {/* Frontend Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Globe className="text-cyan-400" />
                Frontend Development
              </h2>
              <div className="space-y-4">
                {frontendSkills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-gray-400">{skill.level}%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1 }}
                        className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Backend Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Server className="text-purple-400" />
                Backend Development
              </h2>
              <div className="space-y-4">
                {backendSkills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-gray-400">{skill.level}%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1 }}
                        className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Learning Path */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
            >
              <h2 className="text-xl font-bold mb-4">Learning Roadmap</h2>
              <div className="space-y-3">
                {[
                  { title: "HTML & CSS Fundamentals", status: "completed", icon: Globe, slug: "html-css" },
                  { title: "JavaScript Basics", status: "in-progress", icon: Code, slug: "javascript" },
                  { title: "React Fundamentals", status: "upcoming", icon: Layers, slug: "react" },
                  { title: "Backend with Node.js", status: "upcoming", icon: Server, slug: "nodejs" },
                  { title: "Database & SQL", status: "upcoming", icon: Database, slug: "database" },
                  { title: "AWS Cloud Services", status: "upcoming", icon: Cloud, slug: "aws" },
                ].map((item) => (
                  <Link
                    key={item.title}
                    href={`/skills/${item.slug}`}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.02] ${
                      item.status === "completed"
                        ? "bg-green-500/10 border border-green-500/20"
                        : item.status === "in-progress"
                        ? "bg-cyan-500/10 border border-cyan-500/20"
                        : "bg-white/5 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        item.status === "completed"
                          ? "bg-green-500"
                          : item.status === "in-progress"
                          ? "bg-cyan-500"
                          : "bg-white/10"
                      }`}
                    >
                      <item.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-gray-400 capitalize">
                        {item.status.replace("-", " ")}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Daily Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
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
                    <span className="text-cyan-400">
                      {completedTasks}/{studyTasks.length}
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                      style={{
                        width: `${(completedTasks / studyTasks.length) * 100}%`,
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

            {/* Quick Practice */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
            >
              <h2 className="text-xl font-bold mb-4">Quick Practice Ideas</h2>
              <div className="space-y-3">
                {[
                  { task: "Build a responsive navbar", lang: "HTML/CSS" },
                  { task: "Create a todo list app", lang: "JavaScript" },
                  { task: "API data fetching", lang: "JavaScript" },
                  { task: "Simple calculator", lang: "Python" },
                ].map((item) => (
                  <div
                    key={item.task}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer"
                  >
                    <Code className="h-4 w-4 text-cyan-400" />
                    <div className="flex-1">
                      <p className="text-sm">{item.task}</p>
                      <p className="text-xs text-gray-400">{item.lang}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-500" />
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
