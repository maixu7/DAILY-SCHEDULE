"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface MissionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  progress?: number;
  gradient: string;
  children?: ReactNode;
}

export function MissionCard({
  title,
  description,
  icon,
  progress,
  gradient,
  children,
}: MissionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
    >
      <div
        className={`absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br ${gradient} opacity-20 blur-3xl transition-opacity group-hover:opacity-30`}
      />

      <div className="relative z-10">
        <div className="mb-4 flex items-start justify-between">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient}`}
          >
            {icon}
          </div>
          {progress !== undefined && (
            <span className="text-sm font-semibold text-white/70">
              {progress}%
            </span>
          )}
        </div>

        <h3 className="mb-1 text-lg font-semibold text-white">{title}</h3>
        <p className="mb-4 text-sm text-white/50">{description}</p>

        {progress !== undefined && (
          <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
            />
          </div>
        )}

        {children}
      </div>
    </motion.div>
  );
}
