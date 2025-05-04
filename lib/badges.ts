/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /lib/badges.ts
 ************************************************************/

// Type definition for user stats
export interface UserStats {
  total_logins: number;
  quizzes_taken: number;
  topics: string[];
}

// Extra object passed to badge condition
export interface BadgeConditionExtra {
  grade?: number;
}

// Badge definition
export interface BadgeRule {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: UserStats, extra?: BadgeConditionExtra) => boolean;
}

// Badge rules and conditions
export const BADGE_RULES: BadgeRule[] = [
  {
    id: 'first_login',
    name: 'Welcome Aboard!',
    description: 'Thanks for joining AI Tutor!',
    icon: '🎉',
    condition: (stats) => stats.total_logins >= 1,
  },
  {
    id: 'first_quiz',
    name: 'First Quiz!',
    description: 'Completed your first quiz.',
    icon: '📘',
    condition: (stats) => stats.quizzes_taken >= 1,
  },
  {
    id: 'five_quizzes',
    name: 'Quiz Master',
    description: 'Completed 5 quizzes.',
    icon: '🥇',
    condition: (stats) => stats.quizzes_taken >= 5,
  },
  {
    id: 'perfect_score',
    name: 'Perfectionist',
    description: 'Scored 100% on a quiz.',
    icon: '💯',
    condition: (_stats, extra) => extra?.grade === 100,
  },
  {
    id: 'three_topics',
    name: 'Explorer',
    description: 'Tried 3 different topics.',
    icon: '🧭',
    condition: (stats) => stats.topics.length >= 3,
  },
  {
    id: 'six_topics',
    name: 'World Traveler',
    description: 'Tried 6 different topics.',
    icon: '🌎',
    condition: (stats) => stats.topics.length >= 6,
  },
  {
    id: 'twelve_topics',
    name: 'Star Gazer',
    description: 'Tried 12 different topics.',
    icon: '🔭',
    condition: (stats) => stats.topics.length >= 12,
  },
  {
    id: 'five_logins',
    name: 'Habit Builder',
    description: 'Logged in 5 days.',
    icon: '📆',
    condition: (stats) => stats.total_logins >= 5,
  },
];
