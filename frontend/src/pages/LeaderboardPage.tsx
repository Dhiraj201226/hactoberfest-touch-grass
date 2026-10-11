import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Flame, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { apiRequest } from '../lib/api';
import { LeaderboardEntry } from '../types';
import { useAuth } from '../context/AuthContext';

export const LeaderboardPage: React.FC = () => {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const data = await apiRequest<LeaderboardEntry[]>('/leaderboard');
        setLeaders(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <span className="text-xl">🥇</span>;
    if (rank === 2) return <span className="text-xl">🥈</span>;
    if (rank === 3) return <span className="text-xl">🥉</span>;
    return <span className="text-sm font-bold text-text-muted font-mono">#{rank}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-900 font-display">
          Community Leaderboard
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Rankings are calculated strictly from verified outdoor missions and genuine nature discoveries.
        </p>
      </div>

      <Card className="shadow-soft-sm overflow-hidden">
        <CardHeader className="border-b border-surface-border">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>Top Naturalists & Explorers</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-surface-border">
            {leaders.map((entry) => {
              const isCurrentUser = entry.user_id === user?.id;
              return (
                <div
                  key={entry.user_id}
                  className={`p-4 flex items-center justify-between transition-colors ${
                    isCurrentUser ? 'bg-forest-50/80 font-semibold' : 'hover:bg-ivory/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 text-center flex items-center justify-center">
                      {getRankBadge(entry.rank)}
                    </div>
                    <Avatar name={entry.display_name || entry.username} size="md" level={entry.level} />
                    <div>
                      <div className="text-sm font-bold text-forest-900 flex items-center gap-2">
                        <span>{entry.display_name || entry.username}</span>
                        {isCurrentUser && (
                          <span className="text-[10px] bg-forest-200 text-forest-900 px-2 py-0.5 rounded-full font-bold">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-text-muted flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-forest-500" /> {entry.verified_quests_count} verified
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-amber-500" /> {entry.current_streak}d streak
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-forest-900 block font-display">
                      {entry.total_xp.toLocaleString()} XP
                    </span>
                    <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">
                      Level {entry.level}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
