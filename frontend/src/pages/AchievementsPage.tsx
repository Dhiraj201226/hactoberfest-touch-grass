import React, { useEffect, useState } from 'react';
import { Award, Lock, CheckCircle2, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { apiRequest } from '../lib/api';
import { Achievement } from '../types';

export const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAchievements() {
      try {
        const data = await apiRequest<Achievement[]>('/achievements');
        setAchievements(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadAchievements();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-900 font-display">
          Achievements & Badges
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Milestones unlocked as you explore the living outdoors and build consistent nature habits.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {achievements.map((ach) => (
          <Card
            key={ach.id}
            className={`transition-all ${
              ach.unlocked
                ? 'border-forest-300 bg-white shadow-soft-sm'
                : 'border-surface-border bg-ivory/40 opacity-70'
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
                  ach.unlocked
                    ? 'bg-forest-100 text-forest-800 shadow-soft-sm'
                    : 'bg-surface-border/60 text-text-muted'
                }`}
              >
                {ach.unlocked ? <Award className="w-6 h-6 text-forest-700" /> : <Lock className="w-5 h-5" />}
              </div>
              <Badge variant="xp">+{ach.xp_reward} XP</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base text-forest-900">{ach.name}</CardTitle>
                {ach.unlocked && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </div>
              <p className="text-xs text-text-muted leading-relaxed">{ach.description}</p>
              <div className="pt-2 text-[11px] font-semibold text-forest-700">
                {ach.unlocked ? '✨ Unlocked' : '🔒 Locked — complete qualifying quests to earn'}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
