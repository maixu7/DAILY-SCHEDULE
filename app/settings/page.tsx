"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Download,
  Upload,
  RefreshCw,
  Search,
  Tag,
  Bell,
  Moon,
  Sun,
  Clock,
  Plus,
  X,
  Check,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useDailyStore } from "@/store/useDailyStore";
import { useHistoryStore } from "@/store/useHistoryStore";
import { useGoalStore } from "@/store/useGoalStore";

export default function SettingsPage() {
  const {
    settings,
    updateSettings,
    tags,
    addTag,
    removeTag,
    updateTag,
    exportAllData,
    importData,
    resetAllProgress,
  } = useAppStore();

  const { resetDaily } = useDailyStore();
  const { clearHistory } = useHistoryStore();

  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#06b6d4");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const allData = {
      appData: JSON.parse(exportAllData()),
      dailyData: localStorage.getItem("daily-storage"),
      historyData: localStorage.getItem("history-storage"),
      goalData: localStorage.getItem("goal-storage"),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `life-os-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.appData) {
          importData(JSON.stringify(data.appData));
        }
        if (data.dailyData) {
          localStorage.setItem("daily-storage", data.dailyData);
        }
        if (data.historyData) {
          localStorage.setItem("history-storage", data.historyData);
        }
        if (data.goalData) {
          localStorage.setItem("goal-storage", data.goalData);
        }
        setImportStatus("success");
        setTimeout(() => {
          setImportStatus("idle");
          window.location.reload();
        }, 1500);
      } catch {
        setImportStatus("error");
        setTimeout(() => setImportStatus("idle"), 3000);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    resetAllProgress();
    resetDaily();
    clearHistory();
    localStorage.removeItem("daily-storage");
    localStorage.removeItem("history-storage");
    localStorage.removeItem("goal-storage");
    setShowResetConfirm(false);
    window.location.reload();
  };

  const handleAddTag = () => {
    if (!newTagName.trim()) return;
    addTag({ name: newTagName.trim(), color: newTagColor });
    setNewTagName("");
    setNewTagColor("#06b6d4");
  };

  const colorOptions = [
    "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4",
    "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280",
  ];

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
          className="flex items-center gap-4 mb-8"
        >
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
            <Settings className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black">Settings</h1>
            <p className="text-gray-400">Manage your Life OS configuration</p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Backup & Export */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-3xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Download className="h-6 w-6 text-cyan-400" />
              <h2 className="text-xl font-bold">Backup & Export</h2>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Export all your data including habits, progress, notes, and settings as a JSON file.
            </p>
            <div className="space-y-4">
              <button
                onClick={handleExport}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-medium hover:opacity-90 transition"
              >
                <Download className="h-5 w-5" />
                Export All Data
              </button>
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full flex items-center justify-center gap-3 py-3 px-4 border rounded-xl font-medium transition ${
                    importStatus === "success"
                      ? "border-green-500 bg-green-500/20 text-green-400"
                      : importStatus === "error"
                      ? "border-red-500 bg-red-500/20 text-red-400"
                      : "border-white/20 hover:bg-white/10"
                  }`}
                >
                  {importStatus === "success" ? (
                    <>
                      <Check className="h-5 w-5" /> Import Successful
                    </>
                  ) : importStatus === "error" ? (
                    <>
                      <X className="h-5 w-5" /> Import Failed
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5" /> Import Backup
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* App Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-3xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Moon className="h-6 w-6 text-purple-400" />
              <h2 className="text-xl font-bold">App Settings</h2>
            </div>
            <div className="space-y-4">
              {/* Theme */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span>Theme</span>
                <div className="flex gap-2">
                  {(["dark", "light", "system"] as const).map((theme) => (
                    <button
                      key={theme}
                      onClick={() => updateSettings({ theme })}
                      className={`px-3 py-1 rounded-lg text-sm capitalize transition ${
                        settings.theme === theme
                          ? "bg-cyan-500 text-white"
                          : "bg-white/10 hover:bg-white/20"
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
              {/* Notifications */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-gray-400" />
                  <span>Notifications</span>
                </div>
                <button
                  onClick={() => updateSettings({ notificationsEnabled: !settings.notificationsEnabled })}
                  className={`w-12 h-6 rounded-full transition ${
                    settings.notificationsEnabled ? "bg-cyan-500" : "bg-white/20"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.notificationsEnabled ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
              {/* Show Completed */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-gray-400" />
                  <span>Show Completed Tasks</span>
                </div>
                <button
                  onClick={() => updateSettings({ showCompletedTasks: !settings.showCompletedTasks })}
                  className={`w-12 h-6 rounded-full transition ${
                    settings.showCompletedTasks ? "bg-cyan-500" : "bg-white/20"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.showCompletedTasks ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
              {/* Daily Goal */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span>Daily Goal (hours)</span>
                </div>
                <input
                  type="number"
                  value={settings.dailyGoalHours}
                  onChange={(e) => updateSettings({ dailyGoalHours: Number(e.target.value) })}
                  className="w-16 px-2 py-1 bg-white/10 rounded-lg text-center"
                  min={1}
                  max={16}
                />
              </div>
            </div>
          </motion.div>

          {/* Pomodoro Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-3xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Clock className="h-6 w-6 text-green-400" />
              <h2 className="text-xl font-bold">Pomodoro Settings</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span>Work Duration (min)</span>
                <input
                  type="number"
                  value={settings.pomodoroWork}
                  onChange={(e) => updateSettings({ pomodoroWork: Number(e.target.value) })}
                  className="w-16 px-2 py-1 bg-white/10 rounded-lg text-center"
                  min={1}
                  max={60}
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span>Short Break (min)</span>
                <input
                  type="number"
                  value={settings.pomodoroBreak}
                  onChange={(e) => updateSettings({ pomodoroBreak: Number(e.target.value) })}
                  className="w-16 px-2 py-1 bg-white/10 rounded-lg text-center"
                  min={1}
                  max={30}
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span>Long Break (min)</span>
                <input
                  type="number"
                  value={settings.pomodoroLongBreak}
                  onChange={(e) => updateSettings({ pomodoroLongBreak: Number(e.target.value) })}
                  className="w-16 px-2 py-1 bg-white/10 rounded-lg text-center"
                  min={1}
                  max={60}
                />
              </div>
            </div>
          </motion.div>

          {/* Tag Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-3xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Tag className="h-6 w-6 text-pink-400" />
              <h2 className="text-xl font-bold">Tag Management</h2>
            </div>
            {/* Add new tag */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="New tag name..."
                className="flex-1 px-3 py-2 bg-white/10 rounded-xl border border-white/10 focus:border-cyan-500 outline-none"
              />
              <div className="flex gap-1 p-1 bg-white/10 rounded-xl">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewTagColor(color)}
                    className={`w-6 h-6 rounded-full transition ${
                      newTagColor === color ? "ring-2 ring-white ring-offset-2 ring-offset-black" : ""
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <button
                onClick={handleAddTag}
                className="p-2 bg-cyan-500 rounded-xl hover:bg-cyan-600 transition"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            {/* Existing tags */}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="text-sm">{tag.name}</span>
                  <button
                    onClick={() => removeTag(tag.id)}
                    className="p-0.5 hover:bg-white/20 rounded-full transition"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-red-500/10 border border-red-500/30 backdrop-blur-xl rounded-3xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="h-6 w-6 text-red-400" />
              <h2 className="text-xl font-bold text-red-400">Danger Zone</h2>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Reset all progress data to zero. This action cannot be undone. Make sure to export your data first.
            </p>
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-3 py-3 px-6 border border-red-500 text-red-400 rounded-xl hover:bg-red-500/20 transition"
              >
                <RefreshCw className="h-5 w-5" />
                Reset All Progress
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-red-400">Are you sure?</span>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 py-2 px-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                >
                  <Trash2 className="h-4 w-4" />
                  Yes, Reset Everything
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="py-2 px-4 border border-white/20 rounded-xl hover:bg-white/10 transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
