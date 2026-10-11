import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { QuestsPage } from './pages/QuestsPage';
import { QuestDetailPage } from './pages/QuestDetailPage';
import { SubmitEvidencePage } from './pages/SubmitEvidencePage';
import { SubmissionDetailPage } from './pages/SubmissionDetailPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { ChallengesPage } from './pages/ChallengesPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminModerationPage } from './pages/AdminModerationPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Auth Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Onboarding */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />

          {/* Authenticated Application Shell */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="quests" element={<QuestsPage />} />
            <Route path="quests/:questId" element={<QuestDetailPage />} />
            <Route path="quests/:questId/submit" element={<SubmitEvidencePage />} />
            <Route path="submissions/:submissionId" element={<SubmissionDetailPage />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
            <Route path="achievements" element={<AchievementsPage />} />
            <Route path="challenges" element={<ChallengesPage />} />
            <Route path="profile/:username" element={<ProfilePage />} />
          </Route>

          {/* Staff Moderation */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminModerationPage />} />
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
