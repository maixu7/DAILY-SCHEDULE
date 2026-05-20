"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Search,
  Plus,
  Pin,
  Tag,
  Folder,
  Edit3,
  Trash2,
  X,
  Check,
  ExternalLink,
  BookOpen,
  Video,
  FileText,
  Link2,
} from "lucide-react";
import { useAppStore, Note, Resource } from "@/store/useAppStore";

type TabType = "notes" | "resources";

export default function VaultPage() {
  const {
    notes,
    resources,
    tags,
    addNote,
    updateNote,
    removeNote,
    toggleNotePin,
    addResource,
    updateResource,
    removeResource,
    toggleResourceComplete,
    searchQuery,
    setSearchQuery,
    searchResults,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<TabType>("notes");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // New note/resource form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    url: "",
    type: "article" as Resource["type"],
    category: "general" as Note["category"],
    tags: [] as string[],
    notes: "",
  });

  const categories = ["all", "general", "japanese", "skills", "health", "personal"];
  const resourceTypes = ["youtube", "article", "pdf", "book", "course"];

  const filteredNotes = notes.filter((note) => {
    if (searchQuery) {
      const results = searchResults();
      return results.notes.some((n) => n.id === note.id);
    }
    if (selectedCategory !== "all" && note.category !== selectedCategory) return false;
    if (selectedTags.length > 0 && !selectedTags.some((t) => note.tags.includes(t))) return false;
    return true;
  });

  const filteredResources = resources.filter((resource) => {
    if (searchQuery) {
      const results = searchResults();
      return results.resources.some((r) => r.id === resource.id);
    }
    if (selectedCategory !== "all" && resource.category !== selectedCategory) return false;
    if (selectedTags.length > 0 && !selectedTags.some((t) => resource.tags.includes(t))) return false;
    return true;
  });

  const handleAddNote = () => {
    if (!formData.title.trim()) return;
    addNote({
      title: formData.title,
      content: formData.content,
      tags: formData.tags,
      category: formData.category,
      pinned: false,
    });
    resetForm();
  };

  const handleAddResource = () => {
    if (!formData.title.trim() || !formData.url.trim()) return;
    addResource({
      title: formData.title,
      url: formData.url,
      type: formData.type,
      category: formData.category as Resource["category"],
      tags: formData.tags,
      notes: formData.notes,
      completed: false,
    });
    resetForm();
  };

  const handleUpdateNote = () => {
    if (!editingNote) return;
    updateNote(editingNote.id, {
      title: formData.title,
      content: formData.content,
      tags: formData.tags,
      category: formData.category,
    });
    setEditingNote(null);
    resetForm();
  };

  const handleUpdateResource = () => {
    if (!editingResource) return;
    updateResource(editingResource.id, {
      title: formData.title,
      url: formData.url,
      type: formData.type,
      category: formData.category as Resource["category"],
      tags: formData.tags,
      notes: formData.notes,
    });
    setEditingResource(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      url: "",
      type: "article",
      category: "general",
      tags: [],
      notes: "",
    });
    setShowAddModal(false);
  };

  const startEditNote = (note: Note) => {
    setEditingNote(note);
    setFormData({
      ...formData,
      title: note.title,
      content: note.content,
      category: note.category,
      tags: note.tags,
    });
    setShowAddModal(true);
  };

  const startEditResource = (resource: Resource) => {
    setEditingResource(resource);
    setFormData({
      ...formData,
      title: resource.title,
      url: resource.url,
      type: resource.type,
      category: resource.category,
      tags: resource.tags,
      notes: resource.notes,
    });
    setShowAddModal(true);
  };

  const toggleFormTag = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter((t) => t !== tagId)
        : [...prev.tags, tagId],
    }));
  };

  const getResourceIcon = (type: Resource["type"]) => {
    switch (type) {
      case "youtube":
        return Video;
      case "pdf":
        return FileText;
      case "book":
        return BookOpen;
      default:
        return Link2;
    }
  };

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
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black">Knowledge Vault</h1>
              <p className="text-gray-400">Your second brain for notes and resources</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-medium hover:opacity-90 transition"
          >
            <Plus className="h-5 w-5" />
            Add {activeTab === "notes" ? "Note" : "Resource"}
          </button>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-2xl p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes and resources..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 rounded-xl border border-white/10 focus:border-cyan-500 outline-none"
              />
            </div>
            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("notes")}
                className={`px-4 py-2 rounded-xl font-medium transition ${
                  activeTab === "notes"
                    ? "bg-cyan-500 text-white"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                Notes ({notes.length})
              </button>
              <button
                onClick={() => setActiveTab("resources")}
                className={`px-4 py-2 rounded-xl font-medium transition ${
                  activeTab === "resources"
                    ? "bg-cyan-500 text-white"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                Resources ({resources.length})
              </button>
            </div>
          </div>
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-sm capitalize transition ${
                  selectedCategory === cat
                    ? "bg-purple-500 text-white"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Tag Filter */}
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() =>
                  setSelectedTags((prev) =>
                    prev.includes(tag.id)
                      ? prev.filter((t) => t !== tag.id)
                      : [...prev, tag.id]
                  )
                }
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition ${
                  selectedTags.includes(tag.id)
                    ? "ring-2 ring-white"
                    : "opacity-70 hover:opacity-100"
                }`}
                style={{ backgroundColor: `${tag.color}30`, color: tag.color }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                {tag.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "notes" ? (
            <motion.div
              key="notes"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {/* Pinned notes first */}
              {filteredNotes
                .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
                .map((note) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`bg-white/10 border rounded-2xl p-4 ${
                      note.pinned ? "border-yellow-500/50" : "border-white/10"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {note.pinned && <Pin className="h-4 w-4 text-yellow-400" />}
                          <h3 className="font-bold">{note.title}</h3>
                        </div>
                        <span className="text-xs text-gray-400 capitalize">{note.category}</span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => toggleNotePin(note.id)}
                          className="p-1.5 hover:bg-white/10 rounded-lg transition"
                        >
                          <Pin className={`h-4 w-4 ${note.pinned ? "text-yellow-400" : "text-gray-400"}`} />
                        </button>
                        <button
                          onClick={() => startEditNote(note)}
                          className="p-1.5 hover:bg-white/10 rounded-lg transition"
                        >
                          <Edit3 className="h-4 w-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => removeNote(note.id)}
                          className="p-1.5 hover:bg-red-500/20 rounded-lg transition"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap line-clamp-4">
                      {note.content}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {note.tags.map((tagId) => {
                        const tag = tags.find((t) => t.id === tagId);
                        if (!tag) return null;
                        return (
                          <span
                            key={tagId}
                            className="px-2 py-0.5 rounded-full text-xs"
                            style={{ backgroundColor: `${tag.color}30`, color: tag.color }}
                          >
                            {tag.name}
                          </span>
                        );
                      })}
                    </div>
                    <div className="text-xs text-gray-500 mt-3">
                      Updated: {note.updatedAt}
                    </div>
                  </motion.div>
                ))}
              {filteredNotes.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-400">
                  No notes found. Create your first note!
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="resources"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {filteredResources.map((resource) => {
                const Icon = getResourceIcon(resource.type);
                return (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white/10 border rounded-2xl p-4 ${
                      resource.completed ? "border-green-500/30 opacity-60" : "border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleResourceComplete(resource.id)}
                        className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition ${
                          resource.completed
                            ? "bg-green-500"
                            : "bg-white/10 hover:bg-white/20"
                        }`}
                      >
                        {resource.completed ? (
                          <Check className="h-5 w-5 text-white" />
                        ) : (
                          <Icon className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-bold ${resource.completed ? "line-through text-gray-400" : ""}`}>
                            {resource.title}
                          </h3>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 hover:bg-white/10 rounded transition"
                          >
                            <ExternalLink className="h-4 w-4 text-cyan-400" />
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span className="capitalize">{resource.type}</span>
                          <span>•</span>
                          <span className="capitalize">{resource.category}</span>
                        </div>
                        {resource.notes && (
                          <p className="text-sm text-gray-300 mt-1">{resource.notes}</p>
                        )}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {resource.tags.map((tagId) => {
                            const tag = tags.find((t) => t.id === tagId);
                            if (!tag) return null;
                            return (
                              <span
                                key={tagId}
                                className="px-2 py-0.5 rounded-full text-xs"
                                style={{ backgroundColor: `${tag.color}30`, color: tag.color }}
                              >
                                {tag.name}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => startEditResource(resource)}
                          className="p-2 hover:bg-white/10 rounded-lg transition"
                        >
                          <Edit3 className="h-4 w-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => removeResource(resource.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {filteredResources.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  No resources found. Add your first resource!
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                resetForm();
                setEditingNote(null);
                setEditingResource(null);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-900 border border-white/10 rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {editingNote
                    ? "Edit Note"
                    : editingResource
                    ? "Edit Resource"
                    : activeTab === "notes"
                    ? "Add Note"
                    : "Add Resource"}
                </h2>
                <button
                  onClick={() => {
                    resetForm();
                    setEditingNote(null);
                    setEditingResource(null);
                  }}
                  className="p-2 hover:bg-white/10 rounded-xl transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter title..."
                    className="w-full px-4 py-2 bg-white/10 rounded-xl border border-white/10 focus:border-cyan-500 outline-none"
                  />
                </div>

                {(activeTab === "resources" || editingResource) && (
                  <>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">URL</label>
                      <input
                        type="url"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-4 py-2 bg-white/10 rounded-xl border border-white/10 focus:border-cyan-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Type</label>
                      <div className="flex flex-wrap gap-2">
                        {resourceTypes.map((type) => (
                          <button
                            key={type}
                            onClick={() => setFormData({ ...formData, type: type as Resource["type"] })}
                            className={`px-3 py-1 rounded-lg text-sm capitalize transition ${
                              formData.type === type
                                ? "bg-cyan-500 text-white"
                                : "bg-white/10 hover:bg-white/20"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    {activeTab === "notes" && !editingResource ? "Content" : "Notes"}
                  </label>
                  <textarea
                    value={activeTab === "notes" && !editingResource ? formData.content : formData.notes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [activeTab === "notes" && !editingResource ? "content" : "notes"]: e.target.value,
                      })
                    }
                    placeholder="Write your content here..."
                    rows={5}
                    className="w-full px-4 py-2 bg-white/10 rounded-xl border border-white/10 focus:border-cyan-500 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.filter((c) => c !== "all").map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFormData({ ...formData, category: cat as Note["category"] })}
                        className={`px-3 py-1 rounded-lg text-sm capitalize transition ${
                          formData.category === cat
                            ? "bg-purple-500 text-white"
                            : "bg-white/10 hover:bg-white/20"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => toggleFormTag(tag.id)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition ${
                          formData.tags.includes(tag.id)
                            ? "ring-2 ring-white"
                            : "opacity-70 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: `${tag.color}30`, color: tag.color }}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    resetForm();
                    setEditingNote(null);
                    setEditingResource(null);
                  }}
                  className="flex-1 py-2 border border-white/20 rounded-xl hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (editingNote) {
                      handleUpdateNote();
                    } else if (editingResource) {
                      handleUpdateResource();
                    } else if (activeTab === "notes") {
                      handleAddNote();
                    } else {
                      handleAddResource();
                    }
                  }}
                  className="flex-1 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-medium hover:opacity-90 transition"
                >
                  {editingNote || editingResource ? "Update" : "Add"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
