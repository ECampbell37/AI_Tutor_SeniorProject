/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /lib/badges.ts
 ************************************************************/

//Badge Conditions and Info
export const BADGE_RULES = [
    {
        id: 'first_login',
        name: 'Welcome Aboard!',
        description: 'Thanks for joining AI Tutor!',
        icon: '🎉',
        condition: (stats: any) => stats.total_logins >= 1,
    },      
    {
      id: 'first_quiz',
      name: 'First Quiz!',
      description: 'Completed your first quiz.',
      icon: '📘',
      condition: (stats: any) => stats.quizzes_taken >= 1,
    },
    {
      id: 'five_quizzes',
      name: 'Quiz Master',
      description: 'Completed 5 quizzes.',
      icon: '🥇',
      condition: (stats: any) => stats.quizzes_taken >= 5,
    },
    {
      id: 'perfect_score',
      name: 'Perfectionist',
      description: 'Scored 100% on a quiz.',
      icon: '💯',
      condition: (_: any, extra: any) => extra?.grade === 100,
    },
    {
      id: 'three_topics',
      name: 'Explorer',
      description: 'Tried 3 different topics.',
      icon: '🧭',
      condition: (stats: any) => stats.topics.length >= 3,
    },
    {
      id: 'six_topics',
      name: 'World Traveler',
      description: 'Tried 6 different topics.',
      icon: '🌎',
      condition: (stats: any) => stats.topics.length >= 6,
    },
    {
        id: 'twelve_topics',
        name: 'Star Gazer',
        description: 'Tried 12 different topics.',
        icon: '🔭',
        condition: (stats: any) => stats.topics.length >= 12,
    },
    {
      id: 'five_logins',
      name: 'Habit Builder',
      description: 'Logged in 5 days.',
      icon: '📆',
      condition: (stats: any) => stats.total_logins >= 5,
    },
  ];
  