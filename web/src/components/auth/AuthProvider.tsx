"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Profile, UserPreferences } from "@/types";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  preferences: UserPreferences | null;
  isLoading: boolean;
  needsOnboarding: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshPreferences: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    return data as Profile;
  }, []);

  const fetchPreferences = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No preferences exist - create them for existing users
        const { data: newPrefs, error: insertError } = await supabase
          .from("user_preferences")
          .insert({ user_id: userId })
          .select()
          .single();

        if (insertError) {
          console.error("Error creating preferences:", insertError);
          return null;
        }
        return newPrefs as UserPreferences;
      }
      console.error("Error fetching preferences:", error);
      return null;
    }

    return data as UserPreferences;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  }, [user, fetchProfile]);

  const refreshPreferences = useCallback(async () => {
    if (user) {
      const prefsData = await fetchPreferences(user.id);
      setPreferences(prefsData);
    }
  }, [user, fetchPreferences]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
          const [profileData, prefsData] = await Promise.all([
            fetchProfile(session.user.id),
            fetchPreferences(session.user.id),
          ]);
          setProfile(profileData);
          setPreferences(prefsData);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        const [profileData, prefsData] = await Promise.all([
          fetchProfile(session.user.id),
          fetchPreferences(session.user.id),
        ]);
        setProfile(profileData);
        setPreferences(prefsData);
      } else {
        setUser(null);
        setProfile(null);
        setPreferences(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile, fetchPreferences]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setPreferences(null);
  };

  const needsOnboarding = Boolean(
    user && preferences && !preferences.onboarding_completed
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        preferences,
        isLoading,
        needsOnboarding,
        signOut: handleSignOut,
        refreshProfile,
        refreshPreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
