import { type ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bookmark,
  Menu,
  X,
  Sparkles
} from "lucide-react";
import { SavedProfilesPanel } from "./SavedProfilesPanel";
import { useSearchStore } from "@/store/searchStore";
import { useEffect } from "react";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const [showSavedPanel, setShowSavedPanel] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { savedProfiles, fetchSavedProfiles } = useSearchStore();

  useEffect(() => {
    fetchSavedProfiles();
  }, [fetchSavedProfiles]);

  const savedCount = savedProfiles.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950">
      <header className="sticky top-0 z-50 glass-effect border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2.5 group">
                <motion.div
                  whileHover={{ rotate: 12, scale: 1.05 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 rounded-xl blur opacity-60 group-hover:opacity-100 transition-opacity" />
                  <div className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 p-2 rounded-xl">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </motion.div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Wobb
                  </span>
                  <span className="hidden sm:inline text-xs font-medium text-gray-500 dark:text-gray-400 ml-1.5">
                    Influencer Search
                  </span>
                </div>
              </Link>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === "/"
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                <Search className="w-4 h-4" />
                Search
              </Link>
              <button
                onClick={() => setShowSavedPanel(true)}
                className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-all"
              >
                <Bookmark className="w-4 h-4" />
                Saved List
                {savedCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-orange-400 rounded-full"
                  >
                    {savedCount}
                  </motion.span>
                )}
              </button>
            </nav>

            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setShowSavedPanel(true)}
                className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <Bookmark className="w-5 h-5" />
                {savedCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-orange-400 rounded-full">
                    {savedCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200/50 dark:border-gray-800/50"
            >
              <nav className="flex flex-col p-4 gap-1">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === "/"
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  <Search className="w-5 h-5" />
                  Search Influencers
                </Link>
                <button
                  onClick={() => {
                    setShowSavedPanel(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300"
                >
                  <Bookmark className="w-5 h-5" />
                  Saved List ({savedCount})
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {title && (
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6"
          >
            {title}
          </motion.h1>
        )}
        {children}
      </main>

      <SavedProfilesPanel isOpen={showSavedPanel} onClose={() => setShowSavedPanel(false)} />
    </div>
  );
}
