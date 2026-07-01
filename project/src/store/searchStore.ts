import { create } from "zustand";
import type { Platform, SavedProfile } from "@/types";
import { supabase } from "@/lib/supabase";

interface SearchState {
  platform: Platform;
  searchQuery: string;
  savedProfiles: SavedProfile[];
  isLoading: boolean;
  error: string | null;
  setPlatform: (platform: Platform) => void;
  setSearchQuery: (query: string) => void;
  addProfile: (profile: Omit<SavedProfile, "id" | "added_at">) => Promise<boolean>;
  removeProfile: (id: string) => Promise<void>;
  fetchSavedProfiles: () => Promise<void>;
  isProfileSaved: (userId: string, platform: Platform) => boolean;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  platform: "instagram",
  searchQuery: "",
  savedProfiles: [],
  isLoading: false,
  error: null,

  setPlatform: (platform) => {
    set({ platform, searchQuery: "" });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  addProfile: async (profile) => {
    const { savedProfiles } = get();
    const exists = savedProfiles.some(
      (p) => p.user_id === profile.user_id && p.platform === profile.platform
    );
    if (exists) return false;

    try {
      const { data, error } = await supabase
        .from("saved_profiles")
        .insert({
          user_id: profile.user_id,
          username: profile.username,
          fullname: profile.fullname,
          picture: profile.picture,
          platform: profile.platform,
          followers: profile.followers,
          is_verified: profile.is_verified,
          url: profile.url,
        })
        .select()
        .single();

      if (error) throw error;

      set({ savedProfiles: [...savedProfiles, data as SavedProfile] });
      return true;
    } catch (error) {
      console.error("Error adding profile:", error);
      return false;
    }
  },

  removeProfile: async (id) => {
    try {
      const { error } = await supabase
        .from("saved_profiles")
        .delete()
        .eq("id", id);

      if (error) throw error;

      set((state) => ({
        savedProfiles: state.savedProfiles.filter((p) => p.id !== id),
      }));
    } catch (error) {
      console.error("Error removing profile:", error);
    }
  },

  fetchSavedProfiles: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("saved_profiles")
        .select("*")
        .order("added_at", { ascending: false });

      if (error) throw error;

      set({ savedProfiles: (data as SavedProfile[]) || [], isLoading: false });
    } catch (error) {
      console.error("Error fetching saved profiles:", error);
      set({ error: "Failed to load saved profiles", isLoading: false });
    }
  },

  isProfileSaved: (userId, platform) => {
    const { savedProfiles } = get();
    return savedProfiles.some(
      (p) => p.user_id === userId && p.platform === platform
    );
  },
}));
