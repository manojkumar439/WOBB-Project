import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Users,
  TrendingUp,
  Heart,
  MessageCircle,
  Eye,
  Film,
  Check,
  Plus,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile, ProfileDetailResponse, Platform } from "@/types";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { getPlatformLabel } from "@/utils/dataHelpers";
import { useSearchStore } from "@/store/searchStore";

function formatNumber(count: number): string {
  if (count >= 1000000) return (count / 1000000).toFixed(2) + "M";
  if (count >= 1000) return (count / 1000).toFixed(1) + "K";
  return String(count);
}

function StatCard({
  icon: Icon,
  label,
  value,
  color = "blue",
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color?: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: "from-blue-500 to-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    pink: "from-pink-500 to-rose-500 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400",
    green: "from-green-500 to-emerald-500 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    purple: "from-purple-500 to-violet-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    orange: "from-orange-500 to-amber-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
  };

  const classes = colorClasses[color] || colorClasses.blue;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`${classes.split(" ").slice(2).join(" ")} rounded-xl p-4 border border-gray-100 dark:border-gray-700`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-gradient-to-r ${classes.split(" ").slice(0, 2).join(" ")}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = (searchParams.get("platform") || "instagram") as Platform;
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const { addProfile, isProfileSaved } = useSearchStore();
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!username) return;

    loadProfileByUsername(username)
      .then((data) => {
        if (data) {
          setProfileData(data);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoaded(true));
  }, [username]);

  if (!username) {
    return (
      <Layout>
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400">Invalid profile</p>
          <Link to="/" className="text-blue-500 hover:underline mt-2 inline-block">
            Back to search
          </Link>
        </div>
      </Layout>
    );
  }

  if (!loaded) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading profile...</p>
        </div>
      </Layout>
    );
  }

  if (error || !profileData) {
    return (
      <Layout>
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-600 dark:text-red-400 font-medium mb-2">
            Could not load profile details
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            Profile for @{username} not found
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to search
          </Link>
        </div>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;
  const isSaved = isProfileSaved(user.user_id, platform);

  const handleAddToList = async () => {
    if (isSaved || isAdding) return;

    setIsAdding(true);
    await addProfile({
      user_id: user.user_id,
      username: user.username,
      fullname: user.fullname,
      picture: user.picture,
      platform,
      followers: user.followers,
      is_verified: user.is_verified,
      url: user.url,
    });
    setIsAdding(false);
  };

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to search
        </Link>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row gap-4 -mt-12">
              <motion.img
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={user.picture}
                alt={user.fullname}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white dark:ring-gray-800 shadow-lg"
              />

              <div className="flex-1 pt-2 sm:pt-4">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {user.fullname}
                      </h1>
                      <VerifiedBadge verified={user.is_verified} />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={user.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-medium transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="hidden sm:inline">View Profile</span>
                    </a>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToList}
                      disabled={isSaved || isAdding}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        isSaved
                          ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                          : "bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
                      }`}
                    >
                      {isSaved ? (
                        <>
                          <Check className="w-4 h-4" />
                          Saved
                        </>
                      ) : isAdding ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Add to List
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-gray-700/50 rounded-full text-sm text-gray-600 dark:text-gray-300">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        platform === "instagram"
                          ? "bg-gradient-to-r from-purple-500 to-pink-500"
                          : platform === "youtube"
                          ? "bg-red-500"
                          : "bg-black dark:bg-white"
                      }`}
                    />
                    {getPlatformLabel(platform)}
                  </span>
                  {user.is_business && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full text-xs font-medium text-blue-600 dark:text-blue-400">
                      Business Account
                    </span>
                  )}
                </div>
              </div>
            </div>

            {user.description && (
              <p className="mt-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                {user.description}
              </p>
            )}

            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
              <StatCard
                icon={Users}
                label="Followers"
                value={formatNumber(user.followers)}
                color="blue"
              />
              <StatCard
                icon={TrendingUp}
                label="Engagement Rate"
                value={
                  user.engagement_rate !== undefined
                    ? (user.engagement_rate * 100).toFixed(2) + "%"
                    : "N/A"
                }
                color="pink"
              />
              {user.posts_count !== undefined && (
                <StatCard
                  icon={Film}
                  label="Posts"
                  value={formatNumber(user.posts_count)}
                  color="purple"
                />
              )}
              {user.avg_likes !== undefined && (
                <StatCard
                  icon={Heart}
                  label="Avg Likes"
                  value={formatNumber(user.avg_likes)}
                  color="red"
                />
              )}
              {user.avg_comments !== undefined && (
                <StatCard
                  icon={MessageCircle}
                  label="Avg Comments"
                  value={formatNumber(user.avg_comments)}
                  color="green"
                />
              )}
              {user.avg_views !== undefined && user.avg_views > 0 && (
                <StatCard
                  icon={Eye}
                  label="Avg Views"
                  value={formatNumber(user.avg_views)}
                  color="orange"
                />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
