"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Code,
  Globe,
  Layers,
  Server,
  Database,
  Cloud,
  ArrowLeft,
  Check,
  Clock,
  BookOpen,
  Video,
  FileText,
  ExternalLink,
  Play,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import { useDailyStore } from "@/store/useDailyStore";

const skillData: Record<string, {
  title: string;
  description: string;
  icon: typeof Code;
  color: string;
  topics: {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    resources: { type: "video" | "article" | "docs"; title: string; url: string }[];
    exercises: string[];
  }[];
  totalHours: number;
}> = {
  "html-css": {
    title: "HTML & CSS Fundamentals",
    description: "Learn the building blocks of web development",
    icon: Globe,
    color: "from-orange-500 to-red-500",
    totalHours: 20,
    topics: [
      {
        id: "html-basics",
        title: "HTML Basics",
        description: "Document structure, semantic elements, forms, and inputs",
        completed: true,
        resources: [
          { type: "video", title: "HTML Crash Course", url: "https://www.youtube.com/results?search_query=html+crash+course" },
          { type: "docs", title: "MDN HTML Guide", url: "https://developer.mozilla.org/en-US/docs/Learn/HTML" },
        ],
        exercises: ["Create a personal profile page", "Build a form with validation", "Make a semantic blog layout"],
      },
      {
        id: "css-styling",
        title: "CSS Styling",
        description: "Selectors, properties, box model, positioning",
        completed: true,
        resources: [
          { type: "video", title: "CSS Fundamentals", url: "https://www.youtube.com/results?search_query=css+fundamentals" },
          { type: "article", title: "CSS Tricks Guide", url: "https://css-tricks.com/" },
        ],
        exercises: ["Style a navigation bar", "Create a card component", "Build a responsive grid"],
      },
      {
        id: "flexbox",
        title: "Flexbox Layout",
        description: "Modern layout techniques with flexbox",
        completed: false,
        resources: [
          { type: "video", title: "Flexbox Tutorial", url: "https://www.youtube.com/results?search_query=flexbox+tutorial" },
          { type: "docs", title: "Flexbox Guide", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/" },
        ],
        exercises: ["Create a flexible navbar", "Build a card gallery", "Design a dashboard layout"],
      },
      {
        id: "grid",
        title: "CSS Grid",
        description: "Advanced layout with CSS Grid",
        completed: false,
        resources: [
          { type: "video", title: "CSS Grid Tutorial", url: "https://www.youtube.com/results?search_query=css+grid+tutorial" },
          { type: "docs", title: "Grid Guide", url: "https://css-tricks.com/snippets/css/complete-guide-grid/" },
        ],
        exercises: ["Build a photo gallery", "Create a complex page layout", "Design a responsive template"],
      },
    ],
  },
  "javascript": {
    title: "JavaScript Basics",
    description: "Programming fundamentals and DOM manipulation",
    icon: Code,
    color: "from-yellow-500 to-orange-500",
    totalHours: 40,
    topics: [
      {
        id: "js-fundamentals",
        title: "JavaScript Fundamentals",
        description: "Variables, data types, operators, and control flow",
        completed: false,
        resources: [
          { type: "video", title: "JS Crash Course", url: "https://www.youtube.com/results?search_query=javascript+crash+course" },
          { type: "docs", title: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
        ],
        exercises: ["Create a calculator", "Build a guessing game", "Make a simple todo list"],
      },
      {
        id: "functions",
        title: "Functions & Scope",
        description: "Function declarations, expressions, arrow functions, closures",
        completed: false,
        resources: [
          { type: "video", title: "JS Functions", url: "https://www.youtube.com/results?search_query=javascript+functions+tutorial" },
          { type: "article", title: "Understanding Functions", url: "https://javascript.info/function-basics" },
        ],
        exercises: ["Create utility functions", "Build a callback system", "Implement a closure example"],
      },
      {
        id: "arrays-objects",
        title: "Arrays & Objects",
        description: "Working with collections and data structures",
        completed: false,
        resources: [
          { type: "video", title: "JS Arrays", url: "https://www.youtube.com/results?search_query=javascript+arrays+methods" },
          { type: "docs", title: "Array Methods", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array" },
        ],
        exercises: ["Filter and map data", "Sort and search arrays", "Transform objects"],
      },
      {
        id: "dom",
        title: "DOM Manipulation",
        description: "Selecting, creating, and modifying elements",
        completed: false,
        resources: [
          { type: "video", title: "DOM Tutorial", url: "https://www.youtube.com/results?search_query=javascript+dom+tutorial" },
          { type: "docs", title: "DOM Guide", url: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model" },
        ],
        exercises: ["Build an interactive form", "Create a dynamic list", "Make a tab interface"],
      },
    ],
  },
  "react": {
    title: "React Fundamentals",
    description: "Build modern user interfaces with React",
    icon: Layers,
    color: "from-cyan-500 to-blue-500",
    totalHours: 50,
    topics: [
      {
        id: "react-basics",
        title: "React Basics",
        description: "Components, JSX, and props",
        completed: false,
        resources: [
          { type: "video", title: "React Crash Course", url: "https://www.youtube.com/results?search_query=react+crash+course" },
          { type: "docs", title: "React Documentation", url: "https://react.dev/learn" },
        ],
        exercises: ["Create your first component", "Build a props-based card", "Make a component library"],
      },
      {
        id: "state-hooks",
        title: "State & Hooks",
        description: "useState, useEffect, and custom hooks",
        completed: false,
        resources: [
          { type: "video", title: "React Hooks", url: "https://www.youtube.com/results?search_query=react+hooks+tutorial" },
          { type: "docs", title: "Hooks Reference", url: "https://react.dev/reference/react" },
        ],
        exercises: ["Build a counter app", "Create a data fetching hook", "Make a form with state"],
      },
      {
        id: "routing",
        title: "React Router",
        description: "Client-side navigation and routing",
        completed: false,
        resources: [
          { type: "video", title: "React Router Tutorial", url: "https://www.youtube.com/results?search_query=react+router+tutorial" },
          { type: "docs", title: "React Router Docs", url: "https://reactrouter.com/" },
        ],
        exercises: ["Set up basic routing", "Create nested routes", "Implement route guards"],
      },
    ],
  },
  "nodejs": {
    title: "Backend with Node.js",
    description: "Server-side JavaScript development",
    icon: Server,
    color: "from-green-600 to-green-400",
    totalHours: 45,
    topics: [
      {
        id: "node-basics",
        title: "Node.js Basics",
        description: "Runtime, modules, and npm",
        completed: false,
        resources: [
          { type: "video", title: "Node.js Crash Course", url: "https://www.youtube.com/results?search_query=nodejs+crash+course" },
          { type: "docs", title: "Node.js Docs", url: "https://nodejs.org/docs" },
        ],
        exercises: ["Create a simple server", "Work with file system", "Build a CLI tool"],
      },
      {
        id: "express",
        title: "Express.js Framework",
        description: "Building REST APIs with Express",
        completed: false,
        resources: [
          { type: "video", title: "Express Tutorial", url: "https://www.youtube.com/results?search_query=express+js+tutorial" },
          { type: "docs", title: "Express Docs", url: "https://expressjs.com/" },
        ],
        exercises: ["Build a basic API", "Add middleware", "Implement authentication"],
      },
    ],
  },
  "database": {
    title: "Database & SQL",
    description: "Data storage and management",
    icon: Database,
    color: "from-blue-500 to-purple-500",
    totalHours: 35,
    topics: [
      {
        id: "sql-basics",
        title: "SQL Fundamentals",
        description: "SELECT, INSERT, UPDATE, DELETE queries",
        completed: false,
        resources: [
          { type: "video", title: "SQL Tutorial", url: "https://www.youtube.com/results?search_query=sql+tutorial+for+beginners" },
          { type: "article", title: "SQL Guide", url: "https://www.w3schools.com/sql/" },
        ],
        exercises: ["Write basic queries", "Join tables", "Aggregate data"],
      },
      {
        id: "database-design",
        title: "Database Design",
        description: "Schema design and normalization",
        completed: false,
        resources: [
          { type: "video", title: "Database Design", url: "https://www.youtube.com/results?search_query=database+design+tutorial" },
          { type: "article", title: "Design Principles", url: "https://www.geeksforgeeks.org/database-normalization-normal-forms/" },
        ],
        exercises: ["Design a blog schema", "Create relationships", "Normalize a database"],
      },
    ],
  },
  "aws": {
    title: "AWS Cloud Services",
    description: "Cloud computing and deployment",
    icon: Cloud,
    color: "from-orange-500 to-yellow-500",
    totalHours: 60,
    topics: [
      {
        id: "aws-basics",
        title: "AWS Fundamentals",
        description: "Core services and console navigation",
        completed: false,
        resources: [
          { type: "video", title: "AWS Crash Course", url: "https://www.youtube.com/results?search_query=aws+crash+course" },
          { type: "docs", title: "AWS Documentation", url: "https://docs.aws.amazon.com/" },
        ],
        exercises: ["Create an AWS account", "Explore the console", "Set up IAM users"],
      },
      {
        id: "ec2-s3",
        title: "EC2 & S3",
        description: "Compute and storage services",
        completed: false,
        resources: [
          { type: "video", title: "EC2 Tutorial", url: "https://www.youtube.com/results?search_query=aws+ec2+tutorial" },
          { type: "video", title: "S3 Tutorial", url: "https://www.youtube.com/results?search_query=aws+s3+tutorial" },
        ],
        exercises: ["Launch an EC2 instance", "Host a static site on S3", "Configure security groups"],
      },
    ],
  },
};

export default function SkillDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const skill = skillData[slug];

  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(
    new Set(skill?.topics.filter((t) => t.completed).map((t) => t.id) || [])
  );

  if (!skill) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Skill not found</h1>
          <Link href="/skills" className="text-cyan-400 hover:underline">
            Back to Skills
          </Link>
        </div>
      </main>
    );
  }

  const Icon = skill.icon;
  const completedCount = completedTopics.size;
  const totalTopics = skill.topics.length;
  const progress = Math.round((completedCount / totalTopics) * 100);

  const toggleTopicComplete = (topicId: string) => {
    setCompletedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) {
        next.delete(topicId);
      } else {
        next.add(topicId);
      }
      return next;
    });
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video":
        return Video;
      case "article":
        return FileText;
      default:
        return BookOpen;
    }
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className={`absolute inset-0 bg-[radial-gradient(circle_at_top_right,${skill.color.includes("orange") ? "#f97316" : skill.color.includes("yellow") ? "#facc15" : skill.color.includes("cyan") ? "#06b6d4" : "#8b5cf6"},transparent_40%)] opacity-20`} />
      <div className="absolute inset-0 backdrop-blur-3xl" />

      <div className="relative z-10 px-6 md:px-10 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/skills"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Skills
          </Link>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${skill.color}`}>
                <Icon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black">{skill.title}</h1>
                <p className="text-gray-400">{skill.description}</p>
              </div>
            </div>

            {/* Progress Circle */}
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
                  stroke="url(#progressGradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${progress * 2.51} 251`}
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black">{progress}%</span>
                <span className="text-xs text-gray-400">Complete</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 border border-white/10 rounded-2xl p-4"
          >
            <Clock className="h-5 w-5 text-cyan-400 mb-2" />
            <div className="text-2xl font-bold">{skill.totalHours}h</div>
            <div className="text-sm text-gray-400">Estimated Time</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 border border-white/10 rounded-2xl p-4"
          >
            <BookOpen className="h-5 w-5 text-purple-400 mb-2" />
            <div className="text-2xl font-bold">{totalTopics}</div>
            <div className="text-sm text-gray-400">Topics</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 border border-white/10 rounded-2xl p-4"
          >
            <Check className="h-5 w-5 text-green-400 mb-2" />
            <div className="text-2xl font-bold">{completedCount}</div>
            <div className="text-sm text-gray-400">Completed</div>
          </motion.div>
        </div>

        {/* Topics */}
        <div className="space-y-4">
          {skill.topics.map((topic, index) => {
            const isExpanded = expandedTopic === topic.id;
            const isCompleted = completedTopics.has(topic.id);

            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white/10 border rounded-2xl overflow-hidden transition-all ${
                  isCompleted ? "border-green-500/30" : "border-white/10"
                }`}
              >
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer"
                  onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTopicComplete(topic.id);
                    }}
                    className={`p-2 rounded-xl transition ${
                      isCompleted
                        ? "bg-green-500"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    <Check className={`h-5 w-5 ${isCompleted ? "text-white" : "text-gray-400"}`} />
                  </button>
                  <div className="flex-1">
                    <h3 className={`font-bold ${isCompleted ? "text-gray-400 line-through" : ""}`}>
                      {topic.title}
                    </h3>
                    <p className="text-sm text-gray-400">{topic.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {topic.resources.length} resources
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-white/10 p-4 space-y-4">
                    {/* Resources */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-400 mb-2">Resources</h4>
                      <div className="space-y-2">
                        {topic.resources.map((resource, i) => {
                          const ResourceIcon = getResourceIcon(resource.type);
                          return (
                            <a
                              key={i}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition"
                            >
                              <ResourceIcon className="h-5 w-5 text-cyan-400" />
                              <span className="flex-1">{resource.title}</span>
                              <span className="text-xs px-2 py-1 rounded bg-white/10 capitalize">
                                {resource.type}
                              </span>
                              <ExternalLink className="h-4 w-4 text-gray-400" />
                            </a>
                          );
                        })}
                      </div>
                    </div>

                    {/* Exercises */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-400 mb-2">Practice Exercises</h4>
                      <div className="space-y-2">
                        {topic.exercises.map((exercise, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3 bg-white/5 rounded-xl"
                          >
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">
                              {i + 1}
                            </div>
                            <span>{exercise}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
