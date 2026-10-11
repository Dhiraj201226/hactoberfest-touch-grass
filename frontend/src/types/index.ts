export interface User {
  id: string;
  username: string;
  email: string;
  display_name: string;
  avatar_url?: string | null;
  bio?: string | null;
  role: 'user' | 'admin';
  level: number;
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  profile_visibility: 'public' | 'friends' | 'private';
  onboarding_completed: boolean;
  created_at: string;
}

export type QuestDifficulty = 'easy' | 'medium' | 'hard';
export type QuestCategory = 'plants' | 'birds' | 'trees' | 'weather' | 'photography' | 'exploration' | 'awareness';
export type QuestAttemptStatus = 'AVAILABLE' | 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW';

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  duration_minutes: number;
  instructions: string[];
  completion_criteria: string[];
  safety_notes: string[];
  evidence_type: 'photo' | 'video';
  xp_reward: number;
  source_type: 'curated' | 'ai_generated';
  image_url?: string;
  active: boolean;
  created_at: string;
}

export interface QuestAttempt {
  id: string;
  user_id: string;
  quest_id: string;
  status: QuestAttemptStatus;
  started_at: string;
  submitted_at?: string | null;
  completed_at?: string | null;
  quest?: Quest;
}

export interface VerificationResult {
  id: string;
  submission_id: string;
  detector_provider: string;
  model_version: string;
  predicted_class: string;
  raw_confidence?: number | null;
  result_status: 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW';
  relevance_result?: string | null;
  duplicate_result?: string | null;
  error_code?: string | null;
  created_at: string;
}

export interface Submission {
  id: string;
  user_id: string;
  quest_attempt_id: string;
  media_storage_key: string;
  media_url?: string;
  media_type: string;
  sha256_hash: string;
  perceptual_hash?: string | null;
  description: string;
  status: 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW' | 'PENDING';
  review_reason?: string | null;
  created_at: string;
  quest?: Quest;
  verification?: VerificationResult | null;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement_type: string;
  requirement_value: number;
  xp_reward: number;
  unlocked?: boolean;
  unlocked_at?: string | null;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  display_name: string;
  avatar_url?: string | null;
  level: number;
  total_xp: number;
  verified_quests_count: number;
  current_streak: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  challenge_type: 'daily' | 'weekly' | 'community';
  target_quests_count: number;
  xp_bonus: number;
  start_date: string;
  end_date: string;
  is_joined?: boolean;
  user_progress?: number;
  is_completed?: boolean;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: 'approval' | 'rejection' | 'xp' | 'badge' | 'system';
  is_read: boolean;
  created_at: string;
}
