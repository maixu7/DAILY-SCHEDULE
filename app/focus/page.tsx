"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Brain,
  Code2,
  BookOpen,
  Dumbbell,
  Volume2,
  VolumeX,
  Settings,
  Check,
  Timer,
  Zap,
  Target,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

type TimerMode = "work" | "break" | "longBreak";
type Category = "japanese" | "skills" | "health" | "personal";

export default function FocusPage() {
  const { settings, addFocusSession, getTodayFocusTime, focusSessions } = useAppStore();

  const [mode, setMode] = useState<TimerMode>("work");
  const [timeLeft, setTimeLeft] = useState(settings.pomodoroWork * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [category, setCategory] = useState<Category>("skills");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [customWork, setCustomWork] = useState(settings.pomodoroWork);
  const [customBreak, setCustomBreak] = useState(settings.pomodoroBreak);
  const [customLongBreak, setCustomLongBreak] = useState(settings.pomodoroLongBreak);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getModeDuration = useCallback(
    (m: TimerMode) => {
      switch (m) {
        case "work":
          return customWork * 60;
        case "break":
          return customBreak * 60;
        case "longBreak":
          return customLongBreak * 60;
      }
    },
    [customWork, customBreak, customLongBreak]
  );

  const playSound = useCallback(() => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [soundEnabled]);

  const handleTimerComplete = useCallback(() => {
    playSound();
    if (mode === "work") {
      addFocusSession({
        type: "pomodoro",
        duration: customWork,
        category,
      });
      const newSessions = sessionsCompleted + 1;
      setSessionsCompleted(newSessions);
      if (newSessions % 4 === 0) {
        setMode("longBreak");
        setTimeLeft(customLongBreak * 60);
      } else {
        setMode("break");
        setTimeLeft(customBreak * 60);
      }
    } else {
      setMode("work");
      setTimeLeft(customWork * 60);
    }
    setIsRunning(false);
  }, [
    mode,
    sessionsCompleted,
    customWork,
    customBreak,
    customLongBreak,
    category,
    addFocusSession,
    playSound,
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, handleTimerComplete]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(getModeDuration(mode));
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(getModeDuration(newMode));
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = 1 - timeLeft / getModeDuration(mode);
  const todayMinutes = getTodayFocusTime();
  const todayHours = Math.floor(todayMinutes / 60);
  const todayMins = todayMinutes % 60;

  const categoryIcons: Record<Category, typeof Code2> = {
    skills: Code2,
    japanese: BookOpen,
    health: Dumbbell,
    personal: Brain,
  };

  const modeColors: Record<TimerMode, string> = {
    work: "from-red-500 to-orange-500",
    break: "from-green-500 to-emerald-500",
    longBreak: "from-blue-500 to-cyan-500",
  };

  const todaySessions = focusSessions.filter(
    (s) => s.completedAt.startsWith(new Date().toISOString().split("T")[0])
  );

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Hidden audio element */}
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      {/* Background */}
      <div
        className={`absolute inset-0 bg-[radial-gradient(circle_at_center,${
          mode === "work"
            ? "#dc2626"
            : mode === "break"
            ? "#22c55e"
            : "#3b82f6"
        },transparent_60%)] opacity-20 transition-all duration-1000`}
      />
      <div className="absolute inset-0 backdrop-blur-3xl" />

      <div className="relative z-10 px-6 md:px-10 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${modeColors[mode]}`}>
              <Timer className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black">Focus Mode</h1>
              <p className="text-gray-400">Deep work, distraction-free</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition"
            >
              {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Timer Section */}
          <div className="lg:col-span-2">
            {/* Mode Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center gap-3 mb-8"
            >
              {(["work", "break", "longBreak"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`px-6 py-2 rounded-xl font-medium transition ${
                    mode === m
                      ? `bg-gradient-to-r ${modeColors[m]} text-white`
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  {m === "work" ? "Focus" : m === "break" ? "Short Break" : "Long Break"}
                </button>
              ))}
            </motion.div>

            {/* Timer Circle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center mb-8"
            >
              <div className="relative w-72 h-72 md:w-96 md:h-96">
                {/* Background circle */}
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    stroke={`url(#timerGradient)`}
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${progress * 283} 283`}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      {mode === "work" ? (
                        <>
                          <stop offset="0%" stopColor="#dc2626" />
                          <stop offset="100%" stopColor="#f97316" />
                        </>
                      ) : mode === "break" ? (
                        <>
                          <stop offset="0%" stopColor="#22c55e" />
                          <stop offset="100%" stopColor="#10b981" />
                        </>
                      ) : (
                        <>
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </>
                      )}
                    </linearGradient>
                  </defs>
                </svg>
                {/* Timer display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl md:text-8xl font-black tracking-tight">
                    {formatTime(timeLeft)}
                  </span>
                  <span className="text-gray-400 text-lg mt-2 capitalize">
                    {mode === "work" ? "Focus Time" : mode === "break" ? "Short Break" : "Long Break"}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center gap-4"
            >
              <button
                onClick={resetTimer}
                className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition"
              >
                <RotateCcw className="h-6 w-6" />
              </button>
              <button
                onClick={toggleTimer}
                className={`px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 transition bg-gradient-to-r ${modeColors[mode]} hover:opacity-90`}
              >
                {isRunning ? (
                  <>
                    <Pause className="h-6 w-6" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="h-6 w-6" /> Start
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  if (mode === "work") {
                    switchMode("break");
                  } else {
                    switchMode("work");
                  }
                }}
                className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition"
              >
                <Coffee className="h-6 w-6" />
              </button>
            </motion.div>

            {/* Category Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-8"
            >
              <p className="text-center text-gray-400 mb-3">Working on:</p>
              <div className="flex justify-center gap-3">
                {(Object.keys(categoryIcons) as Category[]).map((cat) => {
                  const Icon = categoryIcons[cat];
                  return (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                        category === cat
                          ? "bg-white/20 border border-white/30"
                          : "bg-white/10 hover:bg-white/15"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="capitalize text-sm">{cat}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Today's Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-3xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Target className="h-6 w-6 text-cyan-400" />
                <h2 className="text-xl font-bold">Today&apos;s Progress</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-cyan-400">{sessionsCompleted}</div>
                  <div className="text-xs text-gray-400">Sessions</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-purple-400">
                    {todayHours}h {todayMins}m
                  </div>
                  <div className="text-xs text-gray-400">Focus Time</div>
                </div>
              </div>
              {/* Session dots */}
              <div className="flex flex-wrap gap-2 mt-4">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i < sessionsCompleted ? "bg-green-500" : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {8 - sessionsCompleted > 0
                  ? `${8 - sessionsCompleted} more sessions to reach daily goal`
                  : "Daily goal reached!"}
              </p>
            </motion.div>

            {/* Recent Sessions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-3xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-6 w-6 text-yellow-400" />
                <h2 className="text-xl font-bold">Recent Sessions</h2>
              </div>
              <div className="space-y-2">
                {todaySessions.length > 0 ? (
                  todaySessions.slice(-5).reverse().map((session, i) => {
                    const Icon = categoryIcons[session.category as Category] || Brain;
                    return (
                      <div
                        key={session.id}
                        className="flex items-center gap-3 p-2 bg-white/5 rounded-xl"
                      >
                        <div className="p-2 bg-white/10 rounded-lg">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium capitalize">{session.category}</div>
                          <div className="text-xs text-gray-400">{session.duration} min</div>
                        </div>
                        <Check className="h-4 w-4 text-green-400" />
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">
                    No sessions completed yet today
                  </p>
                )}
              </div>
            </motion.div>

            {/* Quick Settings */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-3xl p-6"
                >
                  <h2 className="text-xl font-bold mb-4">Timer Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Focus (min)</span>
                      <input
                        type="number"
                        value={customWork}
                        onChange={(e) => setCustomWork(Number(e.target.value))}
                        className="w-20 px-3 py-1 bg-white/10 rounded-lg text-center"
                        min={1}
                        max={90}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Short Break (min)</span>
                      <input
                        type="number"
                        value={customBreak}
                        onChange={(e) => setCustomBreak(Number(e.target.value))}
                        className="w-20 px-3 py-1 bg-white/10 rounded-lg text-center"
                        min={1}
                        max={30}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Long Break (min)</span>
                      <input
                        type="number"
                        value={customLongBreak}
                        onChange={(e) => setCustomLongBreak(Number(e.target.value))}
                        className="w-20 px-3 py-1 bg-white/10 rounded-lg text-center"
                        min={1}
                        max={60}
                      />
                    </div>
                    <button
                      onClick={() => {
                        setTimeLeft(getModeDuration(mode));
                        setShowSettings(false);
                      }}
                      className="w-full py-2 bg-cyan-500 rounded-xl font-medium hover:bg-cyan-600 transition"
                    >
                      Apply Settings
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
