import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar } from '../components/ui/Avatar';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { apiRequest } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Flame, CheckCircle2, Award, Sparkles, Shield } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const targetUsername = username === 'me' ? currentUser?.username : username;

  useEffect(() => {
    async function loadProfile() {
      try {
        if (targetUsername) {
          const data = await apiRequest(`/users/${targetUsername}`);
          setProfile(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [targetUsername]);

  if (loading || !profile) {
    return <div className="p-12 text-center text-text-muted">Loading explorer profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Profile Header Card */}
      <Card className="p-6 sm:p-8 bg-white border border-surface-border shadow-soft-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar name={profile.display_name || profile.username} size="xl" level={profile.level} />
          <div className="flex-1 text-center sm:text-left space-y-2">
            <h1 className="text-2xl font-black text-forest-900 font-display">
              {profile.display_name || profile.username}
            </h1>
            <p className="text-xs text-text-muted font-mono">@{profile.username}</p>
            <p className="text-sm text-text-muted max-w-md">
              {profile.bio || "Outdoor explorer dedicated to spending more time in nature and less time on screens."}
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-3 text-xs font-bold text-forest-900">
              <span className="flex items-center gap-1.5 bg-forest-50 px-3 py-1.5 rounded-xl border border-forest-100">
                <Sparkles className="w-4 h-4 text-forest-600" /> {profile.total_xp} Total XP
              </span>
              <span className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                <Flame className="w-4 h-4 text-amber-600" /> {profile.current_streak} Day Streak
              </span>
              <span className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {profile.verified_quests} Quests Completed
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Privacy Notice */}
      <div className="p-4 rounded-2xl bg-forest-50/70 border border-forest-100 flex items-center gap-3 text-xs text-forest-800">
        <Shield className="w-5 h-5 text-forest-600 flex-shrink-0" />
        <span>
          <strong>Privacy Controls Active:</strong> No precise location logs are stored. Nature discoveries are shared with respectful community privacy.
        </span>
      </div>
    </div>
  );
};
