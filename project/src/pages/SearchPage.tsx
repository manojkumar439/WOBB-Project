import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";
import { useSearchStore } from "@/store/searchStore";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export function SearchPage() {
  const { platform, searchQuery, setPlatform, setSearchQuery } = useSearchStore();

  const allProfiles = extractProfiles(platform);
  const filtered = filterProfiles(allProfiles, searchQuery);

  return (
    <Layout>
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center sm:text-left"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Find Influencers
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg">
            Browse top creators across Instagram, YouTube, and TikTok. Discover their stats,
            engagement rates, and add them to your list.
          </p>
        </motion.div>
      </div>

      <div className="mb-6">
        <PlatformFilter
          selected={platform}
          onChange={setPlatform}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <TrendingUp className="w-4 h-4" />
          <span>
            Showing <span className="font-medium text-gray-700 dark:text-gray-300">{filtered.length}</span> of{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">{allProfiles.length}</span> profiles
          </span>
        </div>
      </motion.div>

      <ProfileList profiles={filtered} platform={platform} />
    </Layout>
  );
}
