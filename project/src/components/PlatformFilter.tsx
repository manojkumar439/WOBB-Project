import { motion } from "framer-motion";
import { Instagram, Youtube, Search } from "lucide-react";
import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";
import { memo } from "react";

function TikTokIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
  );
}

function PlatformIcon({ platform, className = "w-5 h-5" }: { platform: Platform; className?: string }) {
  switch (platform) {
    case "instagram":
      return <Instagram className={className} />;
    case "youtube":
      return <Youtube className={className} />;
    case "tiktok":
      return <TikTokIcon className={className} />;
  }
}

function getPlatformStyles(platform: Platform, isSelected: boolean): string {
  if (isSelected) {
    switch (platform) {
      case "instagram":
        return "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white shadow-lg shadow-pink-500/25";
      case "youtube":
        return "bg-red-500 text-white shadow-lg shadow-red-500/25";
      case "tiktok":
        return "bg-black dark:bg-gray-800 text-white shadow-lg shadow-gray-500/25";
    }
  }
  return "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700";
}

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const PlatformFilter = memo(function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
        {PLATFORMS.map((p) => {
          const isSelected = selected === p;
          return (
            <motion.button
              key={p}
              onClick={() => onChange(p)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${getPlatformStyles(p, isSelected)}`}
            >
              <PlatformIcon platform={p} className="w-4 h-4" />
              {getPlatformLabel(p)}
            </motion.button>
          );
        })}
      </div>

      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by username or name..."
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
        {searchQuery && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <button
              onClick={() => onSearchChange("")}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
});
