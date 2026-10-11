import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Trophy, Award, Sparkles, ArrowRight, ShieldCheck, Compass, CheckCircle2, Footprints } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';
import { Quest, QuestAttempt } from '../types';

export const DashboardPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [activeAttempt, setActiveAttempt] = useState<QuestAttempt | null>(null);
  const [recommendedQuests, setRecommendedQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsData, attemptData, questsData] = await Promise.all([
          apiRequest<any>('/users/me/stats').catch(() => null),
          apiRequest<QuestAttempt | null>('/quests/attempts/active').catch(() => null),
          apiRequest<Quest[]>('/quests').catch(() => []),
        ]);

        if (statsData) {
          setStats(statsData);
          updateUser({
            total_xp: statsData.total_xp,
            level: statsData.level,
            current_streak: statsData.current_streak,
          });
        }
        setActiveAttempt(attemptData);
        setRecommendedQuests(questsData.slice(0, 3));
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const featuredQuest = recommendedQuests[0];
  const currentXp = stats?.total_xp || user?.total_xp || 0;
  const level = stats?.level || user?.level || 1;
  const xpInCurrentLevel = currentXp % 100;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-900 tracking-tight font-display">
            Welcome back, {user?.display_name || user?.username}!
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Ready to step outside? Here is your real-world exploration summary for today.
          </p>
        </div>

        <Link to="/app/quests">
          <Button variant="primary" size="md" className="shadow-soft-sm">
            <Compass className="w-4 h-4 mr-2" /> Discover Quests
          </Button>
        </Link>
      </div>

      {/* Authoritative Live Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border border-forest-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-forest-600" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-text-muted font-bold">Total XP</div>
              <div className="text-xl sm:text-2xl font-black text-forest-900">{currentXp}</div>
            </div>
          </div>
        </Card>

        <Card className="p-5 border border-amber-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-text-muted font-bold">Nature Streak</div>
              <div className="text-xl sm:text-2xl font-black text-forest-900">{stats?.current_streak || 0} Days</div>
            </div>
          </div>
        </Card>

        <Card className="p-5 border border-emerald-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-text-muted font-bold">Quests Verified</div>
              <div className="text-xl sm:text-2xl font-black text-forest-900">{stats?.verified_quests || 0}</div>
            </div>
          </div>
        </Card>

        <Card className="p-5 border border-purple-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-text-muted font-bold">Badges</div>
              <div className="text-xl sm:text-2xl font-black text-forest-900">{stats?.achievements_count || 0}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Quest In Progress (if any) */}
      {activeAttempt && activeAttempt.quest && (
        <div className="bg-forest-900 text-white rounded-3xl p-6 sm:p-8 shadow-soft-lg relative overflow-hidden border border-forest-800">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-800 border border-forest-700 text-xs text-forest-200 font-semibold">
                <Footprints className="w-3.5 h-3.5 text-forest-300" /> Active Mission In Progress
              </div>
              <h2 className="text-2xl font-black tracking-tight font-display">{activeAttempt.quest.title}</h2>
              <p className="text-sm text-forest-100/90 leading-relaxed">{activeAttempt.quest.description}</p>
              <div className="flex items-center gap-4 text-xs text-forest-300 font-medium">
                <span>⏱ ~{activeAttempt.quest.duration_minutes} mins</span>
                <span>•</span>
                <span>🎁 +{activeAttempt.quest.xp_reward} XP</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to={`/app/quests/${activeAttempt.quest.id}/submit?attempt=${activeAttempt.id}`}>
                <Button variant="lime" size="lg" className="w-full sm:w-auto font-bold">
                  Submit Evidence <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Featured Quest of the Day */}
      {featuredQuest && !activeAttempt && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-surface-border shadow-soft-sm grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="category">{featuredQuest.category}</Badge>
              <Badge variant={featuredQuest.difficulty as any}>{featuredQuest.difficulty}</Badge>
              <Badge variant="xp">+{featuredQuest.xp_reward} XP</Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-900 font-display">
              {featuredQuest.title}
            </h2>
            <p className="text-sm text-text-muted leading-relaxed">
              {featuredQuest.description}
            </p>
            <div className="pt-2">
              <Link to={`/app/quests/${featuredQuest.id}`}>
                <Button variant="primary" size="md">
                  Start This Quest <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="md:col-span-5 aspect-[4/3] rounded-2xl overflow-hidden bg-forest-100">
            <img
              src={featuredQuest.image_url || "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80"}
              alt={featuredQuest.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Recommended Quests Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-forest-900 font-display">Today's Recommended Quests</h3>
          <Link to="/app/quests" className="text-xs font-bold text-forest-700 hover:underline">
            View All ({recommendedQuests.length}+)
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedQuests.map((quest) => (
            <Card key={quest.id} className="hover:shadow-soft-md transition-shadow group flex flex-col justify-between">
              <div>
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={quest.image_url || "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80"}
                    alt={quest.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="category">{quest.category}</Badge>
                    <Badge variant={quest.difficulty as any}>{quest.difficulty}</Badge>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <Badge variant="xp">+{quest.xp_reward} XP</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-base group-hover:text-forest-600 transition-colors">
                    {quest.title}
                  </CardTitle>
                  <p className="text-xs text-text-muted line-clamp-2 mt-1">
                    {quest.description}
                  </p>
                </CardHeader>
              </div>

              <div className="p-6 pt-0">
                <Link to={`/app/quests/${quest.id}`} className="block w-full">
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    <span>Inspect Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
