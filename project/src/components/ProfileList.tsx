import { memo } from "react";
import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
}

export const ProfileList = memo(function ProfileList({
  profiles,
  platform,
}: ProfileListProps) {
  if (profiles.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">No profiles found</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Try adjusting your search or filters
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <AnimatePresence mode="popLayout">
        {profiles.map((profile, index) => (
          <ProfileCard
            key={`${platform}-${profile.user_id}`}
            profile={profile}
            platform={platform}
            index={index}
          />
        ))}
      </AnimatePresence>
    </div>
  );
});
