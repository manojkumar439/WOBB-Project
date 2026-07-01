import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ExternalLink, User, Instagram, Youtube } from "lucide-react";
import { useSearchStore } from "@/store/searchStore";
import type { SavedProfile, Platform } from "@/types";
import { getPlatformLabel } from "@/utils/dataHelpers";

interface SavedProfilesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatFollowers(count: number): string {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
  if (count >= 1000) return (count / 1000).toFixed(1) + "K";
  return String(count);
}

function getPlatformColor(platform: Platform): string {
  switch (platform) {
    case "instagram":
      return "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400";
    case "youtube":
      return "bg-red-500";
    case "tiktok":
      return "bg-black dark:bg-gray-800";
    default:
      return "bg-gray-500";
  }
}

function PlatformIcon({ platform, className = "w-4 h-4" }: { platform: Platform; className?: string }) {
  switch (platform) {
    case "instagram":
      return <Instagram className={className} />;
    case "youtube":
      return <Youtube className={className} />;
    case "tiktok":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
        </svg>
      );
  }
}

function SavedProfileCard({ profile, onRemove }: { profile: SavedProfile; onRemove: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <img
            src={profile.picture}
            alt={profile.fullname}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-gray-700"
          />
          <div className={`absolute -bottom-1 -right-1 ${getPlatformColor(profile.platform)} rounded-full p-0.5`}>
            <PlatformIcon platform={profile.platform} className="w-3 h-3 text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="font-semibold text-gray-900 dark:text-white truncate">
              {profile.fullname}
            </p>
            {profile.is_verified && (
              <svg className="w-4 h-4 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">@{profile.username}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {formatFollowers(profile.followers)} followers
            </span>
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {getPlatformLabel(profile.platform)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <a
            href={profile.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function SavedProfilesPanel({ isOpen, onClose }: SavedProfilesPanelProps) {
  const { savedProfiles, removeProfile, isLoading } = useSearchStore();

  const groupedProfiles = savedProfiles.reduce(
    (acc, profile) => {
      if (!acc[profile.platform]) {
        acc[profile.platform] = [];
      }
      acc[profile.platform].push(profile);
      return acc;
    },
    {} as Record<Platform, SavedProfile[]>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Saved List
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {savedProfiles.length} profile{savedProfiles.length !== 1 ? "s" : ""} saved
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
                </div>
              ) : savedProfiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No saved profiles</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Add influencers to your list by clicking "Add to List"
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {(["instagram", "youtube", "tiktok"] as Platform[]).map((platform) => {
                    const profiles = groupedProfiles[platform];
                    if (!profiles || profiles.length === 0) return null;

                    return (
                      <div key={platform}>
                        <div className="flex items-center gap-2 mb-3">
                          <PlatformIcon platform={platform} className="w-4 h-4 text-gray-500" />
                          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                            {getPlatformLabel(platform)}
                          </h3>
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            ({profiles.length})
                          </span>
                        </div>
                        <div className="space-y-2">
                          <AnimatePresence mode="popLayout">
                            {profiles.map((profile) => (
                              <SavedProfileCard
                                key={profile.id}
                                profile={profile}
                                onRemove={() => removeProfile(profile.id)}
                              />
                            ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
