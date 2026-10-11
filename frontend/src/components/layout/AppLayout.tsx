import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Compass, Flame, Trophy, Award, User, LogOut, ShieldAlert, Sparkles, PlusCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';
import { ProgressBar } from '../ui/ProgressBar';

export const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/app', label: 'Dashboard', icon: Compass, end: true },
    { to: '/app/quests', label: 'Quests', icon: Sparkles },
    { to: '/app/leaderboard', label: 'Leaderboard', icon: Trophy },
    { to: '/app/challenges', label: 'Challenges', icon: Flame },
    { to: '/app/achievements', label: 'Badges', icon: Award },
    { to: `/app/profile/${user?.username || 'me'}`, label: 'Profile', icon: User },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ to: '/admin', label: 'Moderation', icon: ShieldAlert });
  }

  // Calculate XP level progress (100 XP per level)
  const currentXp = user?.total_xp || 0;
  const level = user?.level || Math.floor(currentXp / 100) + 1;
  const xpInCurrentLevel = currentXp % 100;

  return (
    <div className="min-h-screen bg-ivory flex flex-col md:flex-row selection:bg-forest-200">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-surface-border sticky top-0 h-screen z-20">
        <div className="p-6 border-b border-surface-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-forest-800 text-forest-200 flex items-center justify-center shadow-soft-sm">
            <Compass className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-forest-900 tracking-tight font-display">NatureQuest</span>
            <span className="block text-[10px] uppercase font-bold text-forest-500 tracking-wider -mt-1">Explore Outdoors</span>
          </div>
        </div>

        {/* User Card in Sidebar */}
        <div className="p-4 mx-4 mt-4 bg-forest-50 rounded-2xl border border-forest-100 space-y-3">
          <div className="flex items-center gap-3">
            <Avatar name={user?.display_name || user?.username || 'Explorer'} level={level} size="md" />
            <div className="overflow-hidden">
              <div className="font-bold text-xs text-forest-900 truncate">{user?.display_name || user?.username}</div>
              <div className="text-[11px] text-text-muted flex items-center gap-1 font-semibold">
                <Flame className="w-3.5 h-3.5 text-earth-warning" />
                <span>{user?.current_streak || 0}d streak</span>
              </div>
            </div>
          </div>
          <ProgressBar current={xpInCurrentLevel} max={100} showLabels={true} />
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-forest-800 text-white font-bold shadow-soft-sm'
                      : 'text-text-muted hover:text-forest-900 hover:bg-forest-50/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 stroke-[2]" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-surface-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-text-muted hover:text-earth-error hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Mobile Top Header */}
        <header className="md:hidden sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-surface-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-forest-800 text-forest-200 flex items-center justify-center shadow-sm">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base text-forest-900 font-display">NatureQuest</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-forest-100 text-forest-800 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Flame className="w-3 h-3 text-earth-warning" /> {user?.current_streak || 0}d
            </span>
            <Avatar name={user?.display_name || user?.username || 'User'} size="sm" />
          </div>
        </header>

        {/* Outdoor Focus Banner */}
        <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-forest-700 text-forest-100 px-4 py-2 text-center text-xs font-medium flex items-center justify-center gap-2">
          <span>🌿 <strong>Rule #1 of NatureQuest:</strong> Inspect the mission, lock your screen, and explore the living outdoors.</span>
        </div>

        {/* Route Page Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-surface-border py-2 px-4 z-40 flex items-center justify-around shadow-soft-lg">
        {navLinks.slice(0, 5).map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 text-[10px] font-bold p-1 rounded-lg transition-colors ${
                  isActive ? 'text-forest-800' : 'text-text-muted hover:text-text-main'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
