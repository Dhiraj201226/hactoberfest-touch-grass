import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, ShieldAlert, CheckCircle2, Footprints, Camera, Award, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { apiRequest } from '../lib/api';
import { Quest, QuestAttempt } from '../types';

export const QuestDetailPage: React.FC = () => {
  const { questId } = useParams<{ questId: string }>();
  const navigate = useNavigate();
  const [quest, setQuest] = useState<Quest | null>(null);
  const [starting, setStarting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuest() {
      try {
        const data = await apiRequest<Quest>(`/quests/${questId}`);
        setQuest(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadQuest();
  }, [questId]);

  const handleStartQuest = async () => {
    setStarting(true);
    try {
      const attempt = await apiRequest<QuestAttempt>(`/quests/${questId}/start`, {
        method: 'POST'
      });
      // Navigate straight to submission or active tracker
      navigate(`/app/quests/${questId}/submit?attempt=${attempt.id}`);
    } catch (e) {
      console.error(e);
    } finally {
      setStarting(false);
    }
  };

  if (loading || !quest) {
    return <div className="p-8 text-center text-text-muted">Loading quest details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Back link */}
      <div>
        <Link to="/app/quests" className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-700 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Quests
        </Link>
      </div>

      {/* Hero Banner Card */}
      <div className="relative rounded-3xl overflow-hidden bg-forest-900 text-white border border-surface-border shadow-soft-lg">
        <div className="h-44 sm:h-52 w-full relative">
          <img
            src={quest.image_url || "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80"}
            alt={quest.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/60 to-transparent" />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant="category">{quest.category}</Badge>
            <Badge variant={quest.difficulty as any}>{quest.difficulty}</Badge>
            {quest.source_type === 'ai_generated' && (
              <Badge variant="lime" className="bg-forest-200 text-forest-950 font-bold">
                ⚡ Ollama AI Generated
              </Badge>
            )}
          </div>
          <div className="absolute bottom-4 left-6 right-6">
            <h1 className="text-xl sm:text-3xl font-black font-display tracking-tight text-white mb-1.5">
              {quest.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-forest-200">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {quest.duration_minutes} Mins Duration</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-lime-300" /> +{quest.xp_reward} XP Reward</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Camera className="w-3.5 h-3.5" /> Photo Evidence Required</span>
            </div>
          </div>
        </div>
      </div>

      {/* Screen Disconnect Reminder */}
      <div className="bg-forest-50 border border-forest-100 rounded-2xl p-4 flex items-center gap-3 text-forest-900 text-xs sm:text-sm">
        <Footprints className="w-5 h-5 text-forest-600 flex-shrink-0" />
        <div>
          <strong>Remember the NatureQuest rule:</strong> Once you tap 'Start Mission', put your phone away. Enjoy your natural surroundings, breathe fresh air, and only take your phone out when capturing evidence!
        </div>
      </div>

      {/* Step by step Instructions */}
      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mission Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-text-muted leading-relaxed">{quest.description}</p>
              <ol className="space-y-3 pt-2">
                {quest.instructions.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-forest-900">
                    <span className="w-6 h-6 rounded-full bg-forest-100 text-forest-800 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Completion Criteria</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5">
                {quest.completion_criteria.map((crit, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-text-main">
                    <CheckCircle2 className="w-4 h-4 text-forest-500 flex-shrink-0" />
                    <span>{crit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info & Safety */}
        <div className="md:col-span-4 space-y-6">
          <Card className="bg-amber-50/50 border-amber-200">
            <CardHeader>
              <div className="flex items-center gap-2 text-earth-warning font-bold text-sm">
                <ShieldAlert className="w-4 h-4" />
                <span>Safety & Ethics</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs text-amber-900 leading-relaxed">
                {quest.safety_notes.map((note, idx) => (
                  <li key={idx}>• {note}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="bg-white p-6 rounded-2xl border border-surface-border space-y-4 shadow-soft-sm">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-text-muted">XP Reward</span>
              <span className="text-forest-800 text-base">+{quest.xp_reward} XP</span>
            </div>
            <Button
              variant="primary"
              size="lg"
              className="w-full text-base font-bold shadow-soft-md"
              onClick={handleStartQuest}
              loading={starting}
            >
              Start Mission Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
