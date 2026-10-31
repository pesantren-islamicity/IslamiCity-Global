export type ActiveTab =
  | "dashboard"
  | "academy"
  | "ai-pivot"
  | "syariah-finance"
  | "muamalah-jobs"
  | "green-coop"
  | "islamicity-tv";

export interface QardhulHasanApplication {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  formerCompany: string;
  layoffDate?: string;
  amountRequested: number;
  businessPlanTitle: string;
  businessCategory?: string;
  monthlyRepaymentAbility: number;
  repaymentPeriodMonths: number;
  status: "Ditinjau" | "Verifikasi Fiqih" | "Disetujui" | "Tersalurkan";
  submittedAt: string;
  notes?: string;
  isGreenCertified?: boolean;
}

export interface JobOpportunity {
  id: string;
  title: string;
  organization: string;
  type: "Full-time" | "Freelance / Proyek" | "Magang Muamalah" | "Kemitraan Usaha" | "Green Job";
  category: "Teknologi & Digital" | "Pertanian & Green Eco" | "Kuliner Halal" | "Pendidikan & Dakwah" | "Logistik & Jasa" | "Kerajinan & Manufaktur";
  location: string;
  isRemote: boolean;
  compensation: string;
  description: string;
  requirements: string[];
  greenBadge: boolean;
  shariaVerified: boolean;
  contactEmail: string;
  postedAt: string;
  applicantsCount: number;
}

export interface SkillBarterListing {
  id: string;
  userName: string;
  formerRole: string;
  city: string;
  offeredSkill: string;
  soughtSkill: string;
  category: string;
  notes: string;
  status: "Tersedia" | "Sedang Barter" | "Selesai";
  createdAt: string;
  contactWa: string;
}

export interface CrowdfundProject {
  id: string;
  title: string;
  initiator: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  investorsCount: number;
  nisbah: string; // e.g. "65% Pengelola : 35% Jamaah"
  returnPeriod: string;
  greenImpact: string;
  description: string;
  image: string;
  isFunded: boolean;
  minInvestment: number;
}

export interface GreenBlueprint {
  id: string;
  title: string;
  tagline: string;
  category: string;
  startupCapitalRange: string;
  bepMonths: string;
  jobsCreatedEstimate: string;
  greenMetrics: string[];
  equipmentNeeded: string[];
  dailyWorkflow: string[];
  shariaContractType: string;
  iconName: string;
}

export interface TVBroadcast {
  id: string;
  title: string;
  speaker: string;
  speakerTitle: string;
  category: string;
  duration: string;
  isLive: boolean;
  viewers: number;
  timeSlot: string;
  description: string;
  videoUrl?: string;
}

export interface ChatMessage {
  id: string;
  user: string;
  city: string;
  text: string;
  time: string;
  badge?: string;
}

export interface EmpowermentBadge {
  id: string;
  name: string;
  category: "infaq" | "barter" | "green-coop" | "dakwah" | "muamalah";
  icon: string;
  description: string;
  howToEarn: string;
  pointsReward: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface EmpowermentTier {
  level: number;
  name: string;
  title: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  badgeBg: string;
  benefits: string[];
}

export interface PointActivity {
  id: string;
  title: string;
  category: "Infaq & Sedekah" | "Barter Keahlian" | "Green Coop" | "AI Karir" | "Edukasi Dakwah";
  points: number;
  date: string;
  time: string;
  description: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  city: string;
  role: "Korban PHK Berdaya" | "Wirausaha Muslim" | "Muzakki & Donatur" | "Mentor Keahlian";
  bio: string;
  primarySkills: string[];
  totalPoints: number;
  unlockedBadgeIds: string[];
  joinedDate: string;
  activities: PointActivity[];
}

export interface ImpactStoryHighlight {
  label: string;
  value: string;
}

export interface ImpactStory {
  headline: string;
  hook: string;
  bodyParagraphs: string[];
  spiritualInsight: string;
  quoteByBeneficiary: string;
  impactHighlights: ImpactStoryHighlight[];
  callToActionText: string;
  hashtags: string[];
  formattedShareText: string;
}

export interface ProductiveWaqfAsset {
  id: string;
  title: string;
  subtitle: string;
  category: "Lahan Pertanian" | "Mesin Produksi" | "Logistik & Armada" | "Energi Terbarukan";
  location: string;
  targetAmount: number;
  collectedAmount: number;
  wakifCount: number;
  unitPrice: number; // e.g. Rp 100.000 / m² or Rp 250.000 / lot
  unitName: string; // "m² Lahan" | "Lot Saham Aset" | "Unit Paket"
  totalUnits: number;
  allocatedUnits: number;
  nazhirName: string;
  bwiRegistrationNo: string;
  greenCoopImpact: string;
  dividendAllocation: string; // Distribution of operational surplus (e.g. 100% to Qardhul Hasan & orphan scholarships)
  imageUrl: string;
  urgencyTag?: string;
  specs: string[];
  beneficiaryTarget: string;
  shariaSupervision: string;
}

export interface WaqfDonor {
  id: string;
  donorName: string;
  isAnonymous: boolean;
  assetTitle: string;
  amount: number;
  units: number;
  timeAgo: string;
  message?: string;
  city: string;
}

export type TerritoryLevel = "RT" | "RW" | "Kelurahan" | "Kecamatan";

export interface AcademyLesson {
  id: string;
  title: string;
  duration: string;
  summary: string;
  keyPoints: string[];
  actionItemSOP: string;
  videoPreviewUrl?: string;
  completed?: boolean;
}

export interface AcademyModule {
  id: string;
  moduleNumber: number;
  title: string;
  pillar: "Masjid & Ruhiyah" | "Ekonomi Bebas Riba" | "Sosial & Ta'awun" | "Ekologi & Pangan" | "Tata Kelola Syura";
  description: string;
  targetAudience: string;
  durationHours: number;
  lessonsCount: number;
  pointsReward: number;
  icon: string;
  badgeEarned: string;
  lessons: AcademyLesson[];
  quizQuestions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface TerritoryPilot {
  id: string;
  name: string;
  level: TerritoryLevel;
  location: string;
  leaderName: string;
  familiesCount: number;
  ibtScore: number; // Indeks Baldatun Thoyyibatun (0-100)
  keyPrograms: string[];
  impactStats: {
    layoffVictimsEmpowered: number;
    zeroRibaFamilies: number;
    monthlyZiswafCollected: number;
    wasteDivertedKg: number;
  };
  imageUrl: string;
  status: "Percontohan Mandiri" | "Akselerasi Binaan" | "Fase Inisiasi";
}

export interface PillarPlan {
  pillarName: string;
  pillarIcon: string;
  strategicGoal: string;
  keyActionItems: string[];
  budgetEstimate: string;
  stakeholders: string[];
  quickWins30Days: string;
}

export interface TerritoryMasterplan {
  territoryName: string;
  level: TerritoryLevel;
  demographicContext: string;
  mainChallenge: string;
  visionStatement: string;
  ibtTargetScore: number;
  hundredDaysRoadmap: {
    phase: string;
    timeline: string;
    milestone: string;
    tasks: string[];
  }[];
  pillars: PillarPlan[];
  fundingStrategy: {
    source: string;
    allocation: string;
    mechanism: string;
  }[];
  institutionalSetup: {
    bodyName: string;
    role: string;
    membership: string;
  }[];
  quranicReference: {
    surah: string;
    verse: string;
    translation: string;
  };
}


