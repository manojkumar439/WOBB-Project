import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink, Check, Plus } from "lucide-react";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { useSearchStore } from "@/store/searchStore";

function formatFollowers(count: number): string {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
  if (count >= 1000) return (count / 1000).toFixed(0) + "K";
  return String(count);
}

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  index: number;
}

export const ProfileCard = memo(function ProfileCard({
  profile,
  platform,
  index,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const { addProfile, isProfileSaved } = useSearchStore();
  const [isAdding, setIsAdding] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const isSaved = isProfileSaved(profile.user_id, platform);

  const handleClick = () => {
    navigate(`/profile/${profile.username}?platform=${platform}`);
  };

  const handleAddToList = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaved || isAdding) return;

    setIsAdding(true);
    const success = await addProfile({
      user_id: profile.user_id,
      username: profile.username,
      fullname: profile.fullname,
      picture: profile.picture,
      platform,
      followers: profile.followers,
      is_verified: profile.is_verified,
      url: profile.url,
    });

    if (success) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    }
    setIsAdding(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      onClick={handleClick}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl p-4 cursor-pointer hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-all duration-300 border border-gray-100 dark:border-gray-700/50"
    >
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={profile.picture}
            alt={profile.fullname}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
            loading="lazy"
          />
          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-0.5 shadow-sm">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                platform === "instagram"
                  ? "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400"
                  : platform === "youtube"
                  ? "bg-red-500"
                  : "bg-black dark:bg-gray-800"
              }`}
            >
              {platform === "instagram" ? (
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 011.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772 4.915 4.915 0 01-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.416-1.363-.466-2.428C2.01 14.056 2 13.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.39 2.525c.638-.248 1.362-.415 2.428-.465C8.88 2.012 9.22 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z" />
                </svg>
              ) : platform === "youtube" ? (
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                </svg>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-gray-900 dark:text-white">
              {profile.fullname}
            </span>
            <VerifiedBadge verified={profile.is_verified} />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            @{profile.username}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {formatFollowers(profile.followers)} followers
            </span>
            {profile.engagement_rate !== undefined && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {(profile.engagement_rate * 100).toFixed(2)}% ER
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={profile.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="hidden sm:flex p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </motion.a>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToList}
            disabled={isSaved || isAdding}
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              isSaved
                ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 cursor-default"
                : "bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md"
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Saved</span>
              </>
            ) : isAdding ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="hidden sm:inline">Adding...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add to List</span>
              </>
            )}

            {showTooltip && (
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap"
              >
                Added to list!
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});
