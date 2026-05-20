"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Heart,
  Languages,
  Code,
  Calendar,
  CalendarDays,
  Settings,
  Zap,
  Timer,
  Brain,
  BarChart3,
  Search,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/focus", label: "Focus Mode", icon: Timer },
  { href: "/vault", label: "Knowledge Vault", icon: Brain },
  { href: "/health", label: "Health", icon: Heart },
  { href: "/japanese", label: "Japanese", icon: Languages },
  { href: "/skills", label: "Skills", icon: Code },
  { href: "/routines", label: "Routines", icon: Calendar },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="flex items-center gap-3 border-b border-white/10 p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-balance font-semibold text-white">Life OS</h1>
          <p className="text-xs text-white/50">2026 Edition</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                className={`relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-cyan-400"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-cyan-500/10 border border-cyan-500/20"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon className="relative z-10 h-5 w-5" />
                <span className="relative z-10">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link href="/settings">
          <motion.div
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </motion.div>
        </Link>
      </div>
    </aside>
  );
}
