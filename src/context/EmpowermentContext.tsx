import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, EmpowermentTier, EmpowermentBadge, PointActivity } from "../types";
import {
  INITIAL_USER_PROFILE,
  ALL_EMPOWERMENT_BADGES,
  getTierByPoints,
  getNextTier,
  EMPOWERMENT_TIERS,
} from "../data/empowermentData";
import confetti from "canvas-confetti";

interface RewardNotification {
  points: number;
  title: string;
  category: PointActivity["category"];
  badgeUnlocked?: string;
  badgeName?: string;
  badgeIcon?: string;
}

interface EmpowermentContextType {
  userProfile: UserProfile;
  currentTier: EmpowermentTier;
  nextTier: EmpowermentTier | null;
  allBadges: EmpowermentBadge[];
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  recentReward: RewardNotification | null;
  clearRewardToast: () => void;
  awardPoints: (
    points: number,
    activityTitle: string,
    category: PointActivity["category"],
    description: string,
    badgeIdToUnlock?: string
  ) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  simulatedBalance: number;
  deductBalance: (amount: number) => boolean;
  topUpBalance: (amount: number) => void;
}

const EmpowermentContext = createContext<EmpowermentContextType | undefined>(undefined);

const PROFILE_STORAGE_KEY = "islamicity_user_profile_v1";
const BALANCE_STORAGE_KEY = "islamicity_simulated_balance_v1";

export const EmpowermentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse user profile from localStorage", e);
        }
      }
    }
    return INITIAL_USER_PROFILE;
  });

  const [simulatedBalance, setSimulatedBalance] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const savedBal = localStorage.getItem(BALANCE_STORAGE_KEY);
      if (savedBal) {
        const parsed = parseInt(savedBal, 10);
        if (!isNaN(parsed)) return parsed;
      }
    }
    return 2500000; // Default simulated balance: Rp 2.500.000
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [recentReward, setRecentReward] = useState<RewardNotification | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem(BALANCE_STORAGE_KEY, simulatedBalance.toString());
  }, [simulatedBalance]);

  const deductBalance = (amount: number): boolean => {
    if (simulatedBalance >= amount) {
      setSimulatedBalance((prev) => prev - amount);
      return true;
    }
    return false;
  };

  const topUpBalance = (amount: number) => {
    setSimulatedBalance((prev) => prev + amount);
  };

  const currentTier = getTierByPoints(userProfile.totalPoints);
  const nextTier = getNextTier(userProfile.totalPoints);

  const allBadges: EmpowermentBadge[] = ALL_EMPOWERMENT_BADGES.map((b) => ({
    ...b,
    isUnlocked: userProfile.unlockedBadgeIds.includes(b.id),
  }));

  const awardPoints = (
    points: number,
    activityTitle: string,
    category: PointActivity["category"],
    description: string,
    badgeIdToUnlock?: string
  ) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const timeStr =
      now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";

    const newActivity: PointActivity = {
      id: `act-${Date.now()}`,
      title: activityTitle,
      category,
      points,
      date: dateStr,
      time: timeStr,
      description,
    };

    let newlyUnlockedBadgeName: string | undefined;
    let newlyUnlockedBadgeIcon: string | undefined;

    setUserProfile((prev) => {
      const updatedPoints = prev.totalPoints + points;
      const updatedBadgeIds = [...prev.unlockedBadgeIds];

      if (badgeIdToUnlock && !updatedBadgeIds.includes(badgeIdToUnlock)) {
        updatedBadgeIds.push(badgeIdToUnlock);
        const b = ALL_EMPOWERMENT_BADGES.find((badge) => badge.id === badgeIdToUnlock);
        if (b) {
          newlyUnlockedBadgeName = b.name;
          newlyUnlockedBadgeIcon = b.icon;
        }
      }

      return {
        ...prev,
        totalPoints: updatedPoints,
        unlockedBadgeIds: updatedBadgeIds,
        activities: [newActivity, ...prev.activities],
      };
    });

    // Show celebration reward toast
    setRecentReward({
      points,
      title: activityTitle,
      category,
      badgeUnlocked: badgeIdToUnlock,
      badgeName: newlyUnlockedBadgeName,
      badgeIcon: newlyUnlockedBadgeIcon,
    });

    // Confetti effect for rewarding empowerment
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#10b981", "#f59e0b", "#065f46", "#3b82f6", "#8b5cf6"],
    });

    // Auto dismiss toast after 6 seconds
    setTimeout(() => {
      setRecentReward((curr) => (curr?.title === activityTitle ? null : curr));
    }, 6000);
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const clearRewardToast = () => setRecentReward(null);

  return (
    <EmpowermentContext.Provider
      value={{
        userProfile,
        currentTier,
        nextTier,
        allBadges,
        isProfileModalOpen,
        setIsProfileModalOpen,
        recentReward,
        clearRewardToast,
        awardPoints,
        updateUserProfile,
        simulatedBalance,
        deductBalance,
        topUpBalance,
      }}
    >
      {children}
    </EmpowermentContext.Provider>
  );
};

export const useEmpowerment = () => {
  const context = useContext(EmpowermentContext);
  if (!context) {
    throw new Error("useEmpowerment must be used within an EmpowermentProvider");
  }
  return context;
};
