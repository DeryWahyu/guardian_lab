"use client";

import { useEffect, useState } from "react";
import { type BadgeItem, BadgesGrid } from "./badges-grid";
import { GamificationHeader } from "./gamification-header";
import { QuizModalPlayer } from "./quiz-modal-player";
import { type QuizNode, SkillTree } from "./skill-tree";

export function AcademyPageView() {
  const [exp, setExp] = useState(250);
  const [streakDays, _setStreakDays] = useState(7);
  const [quizzes, setQuizzes] = useState<QuizNode[]>([]);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);

  const defaultBadges: BadgeItem[] = [
    {
      id: "b1",
      code: "RECRUIT_GUARDIAN",
      title: "Recruit Guardian",
      description: "Langkah pertama di Guardian Lab",
      expReward: 50,
      isUnlocked: true,
    },
    {
      id: "b2",
      code: "ANTI_QUISHING_MASTER",
      title: "Anti-Quishing Master",
      description: "Mendeteksi modus QRIS penipuan",
      expReward: 100,
      isUnlocked: true,
    },
    {
      id: "b3",
      code: "APK_DISSECTOR",
      title: "APK Dissector",
      description: "Membongkar malware Android",
      expReward: 150,
      isUnlocked: false,
    },
    {
      id: "b4",
      code: "PHISHING_HUNTER",
      title: "Phishing Hunter",
      description: "Mendeteksi typosquatting bank",
      expReward: 100,
      isUnlocked: true,
    },
    {
      id: "b5",
      code: "CYBER_SENTINEL",
      title: "Cyber Sentinel",
      description: "Streak aktif 7 hari berturut-turut",
      expReward: 200,
      isUnlocked: true,
    },
    {
      id: "b6",
      code: "COMMUNITY_DEFENDER",
      title: "Community Defender",
      description: "Menyumbang kasus ke komunitas",
      expReward: 150,
      isUnlocked: false,
    },
  ];

  useEffect(() => {
    async function loadQuizzes() {
      try {
        const res = await fetch("/api/academy/quizzes");
        if (res.ok) {
          const data = await res.json();
          setQuizzes(data);
        }
      } catch (err) {
        console.error("Error loading academy quizzes:", err);
      }
    }
    loadQuizzes();
  }, []);

  const handleQuizCompleted = (earned: number) => {
    setExp((prev) => prev + earned);
  };

  return (
    <div className="space-y-6">
      {/* Top Gamification Header */}
      <GamificationHeader exp={exp} streakDays={streakDays} />

      {/* Badges Grid */}
      <BadgesGrid badges={defaultBadges} />

      {/* Duolingo-style Skill Tree */}
      <SkillTree quizzes={quizzes} onSelectQuiz={(id) => setActiveQuizId(id)} />

      {/* Active Quiz Player Modal */}
      {activeQuizId && (
        <QuizModalPlayer
          quizId={activeQuizId}
          onClose={() => setActiveQuizId(null)}
          onCompleted={handleQuizCompleted}
        />
      )}
    </div>
  );
}
