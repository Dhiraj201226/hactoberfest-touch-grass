import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Sparkles, Check, ArrowRight, Shield } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';

const CATEGORIES = [
  { id: 'plants', label: 'Plants & Flora', desc: 'Leaves, wildflowers, moss, fungi' },
  { id: 'birds', label: 'Birds & Wildlife', desc: 'Bird songs, feather details, animal signs' },
  { id: 'trees', label: 'Trees & Forests', desc: 'Bark patterns, ancient canopies, seeds' },
  { id: 'weather', label: 'Clouds & Sky', desc: 'Cirrus formations, golden hour, weather' },
  { id: 'photography', label: 'Macro Nature', desc: 'Tiny textures, water droplets, dew' },
  { id: 'exploration', label: 'Trail Walks', desc: 'Streams, hiking routes, terrain' },
];

export const OnboardingPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['plants', 'trees']);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [availableTime, setAvailableTime] = useState('15');
  const [loading, setLoading] = useState(false);

  const toggleCategory = (id: string) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter(c => c !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await apiRequest('/users/me/onboarding', {
        method: 'POST',
        body: JSON.stringify({
          preferred_categories: selectedCategories,
          preferred_difficulty: difficulty,
          available_minutes: parseInt(availableTime),
          onboarding_completed: true,
        }),
      });
      updateUser({ onboarding_completed: true });
      navigate('/app');
    } catch (e) {
      console.error(e);
      // Fallback navigate
      navigate('/app');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-4 selection:bg-forest-200">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personalize Your Experience</span>
          </div>
          <h1 className="text-3xl font-extrabold text-forest-900 font-display">Welcome to NatureQuest, {user?.display_name || 'Explorer'}!</h1>
          <p className="text-sm text-text-muted">Tell us what you love observing so our AI can curate matching outdoor missions.</p>
        </div>

        <Card className="shadow-soft-md">
          <CardHeader>
            <CardTitle>1. Select Your Observation Interests</CardTitle>
            <CardDescription>Pick what you look for when you step outdoors.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategories.includes(cat.id);
                return (
                  <div
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                      isSelected
                        ? 'border-forest-600 bg-forest-50/70 shadow-sm'
                        : 'border-surface-border bg-white hover:border-forest-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 border ${
                        isSelected ? 'bg-forest-800 border-forest-800 text-white' : 'border-surface-border bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-forest-900">{cat.label}</h4>
                      <p className="text-xs text-text-muted mt-0.5">{cat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-surface-border pt-4 space-y-4">
              <h3 className="text-sm font-bold text-forest-900">2. Preferred Quest Pacing</h3>
              <div className="grid grid-cols-3 gap-3">
                {(['easy', 'medium', 'hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`py-3 px-4 rounded-xl border text-center font-bold text-xs capitalize transition-all ${
                      difficulty === diff
                        ? 'bg-forest-800 text-white border-forest-800 shadow-soft-sm'
                        : 'bg-white text-text-muted border-surface-border hover:bg-forest-50'
                    }`}
                  >
                    {diff} (10-25m)
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-forest-50 border border-forest-100 rounded-xl flex items-center gap-3 text-xs text-forest-800">
              <Shield className="w-4 h-4 text-forest-600 flex-shrink-0" />
              <span>Location privacy: Precise GPS is never continuously tracked. Quests work anywhere outdoors.</span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/app')}>
                Skip for now
              </Button>
              <Button variant="primary" size="md" onClick={handleFinish} loading={loading}>
                Complete Setup <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
