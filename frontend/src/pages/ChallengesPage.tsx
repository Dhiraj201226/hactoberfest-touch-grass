import React, { useEffect, useState } from 'react';
import { Flame, Clock, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { apiRequest } from '../lib/api';
import { Challenge } from '../types';

export const ChallengesPage: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChallenges() {
      try {
        const data = await apiRequest<Challenge[]>('/challenges');
        setChallenges(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadChallenges();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-900 font-display">
          Outdoor Challenges
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Complete grouped missions within the active timeframe to earn bonus XP and community prestige.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {challenges.map((c) => (
          <Card key={c.id} className="shadow-soft-sm flex flex-col justify-between">
            <CardHeader className="space-y-3">
              <div className="flex justify-between items-center">
                <Badge variant="category">{c.challenge_type} Challenge</Badge>
                <Badge variant="xp">+{c.xp_bonus} Bonus XP</Badge>
              </div>
              <CardTitle className="text-lg text-forest-900">{c.title}</CardTitle>
              <p className="text-xs text-text-muted leading-relaxed">{c.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-between text-xs font-semibold text-forest-900">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-forest-600" /> Goal: {c.target_quests_count} Quests
                </span>
                <span className="flex items-center gap-1.5 text-text-muted">
                  <Clock className="w-3.5 h-3.5" /> Active This Week
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
