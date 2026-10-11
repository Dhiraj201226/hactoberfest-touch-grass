import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Sparkles, Compass, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { apiRequest } from '../lib/api';
import { Quest } from '../types';

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'plants', label: '🌿 Plants' },
  { id: 'trees', label: '🌲 Trees' },
  { id: 'birds', label: '🦅 Birds' },
  { id: 'weather', label: '☁️ Sky & Clouds' },
];

export const QuestsPage: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchQuests = async () => {
    setLoading(true);
    try {
      let url = '/quests';
      const params = new URLSearchParams();
      if (category !== 'all') params.append('category', category);
      if (difficulty !== 'all') params.append('difficulty', difficulty);
      if (params.toString()) url += `?${params.toString()}`;

      const data = await apiRequest<Quest[]>(url);
      setQuests(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuests();
  }, [category, difficulty]);

  const handleGenerateAIQuest = async () => {
    setGenerating(true);
    try {
      const generated = await apiRequest<Quest>('/quests/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: category === 'all' ? 'plants' : category,
          difficulty: difficulty === 'all' ? 'easy' : difficulty,
        })
      });
      setQuests([generated, ...quests]);
    } catch (e) {
      console.error('AI generation error', e);
    } finally {
      setGenerating(false);
    }
  };

  const filteredQuests = quests.filter(q =>
    q.title.toLowerCase().includes(search.toLowerCase()) ||
    q.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & AI Generator Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-900 font-display">
            Outdoor Missions
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Pick a real-world task, leave the screen behind, and explore nature.
          </p>
        </div>

        <Button
          variant="lime"
          size="md"
          onClick={handleGenerateAIQuest}
          loading={generating}
          className="shadow-soft-sm font-bold"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Generate New Mission (AI)
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-surface-border shadow-soft-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-text-muted" />
          <input
            type="text"
            placeholder="Search missions (e.g. bark, cloud, leaf)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-surface-border bg-ivory/50 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                category === cat.id
                  ? 'bg-forest-800 text-white shadow-soft-sm'
                  : 'bg-ivory text-text-muted hover:text-forest-900 hover:bg-forest-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quests Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-text-muted gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
          <p className="text-sm font-medium">Loading outdoor missions...</p>
        </div>
      ) : filteredQuests.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-surface-border space-y-4">
          <Compass className="w-12 h-12 text-forest-300 mx-auto" />
          <h3 className="text-lg font-bold text-forest-900">No matching missions found</h3>
          <p className="text-sm text-text-muted max-w-sm mx-auto">
            Try adjusting your search criteria or generate a brand new mission using our open AI generator.
          </p>
          <Button variant="primary" size="sm" onClick={() => { setCategory('all'); setSearch(''); }}>
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuests.map((quest) => (
            <Card key={quest.id} className="hover:shadow-soft-md transition-shadow flex flex-col justify-between group">
              <div>
                <div className="h-44 relative overflow-hidden bg-forest-900">
                  <img
                    src={quest.image_url || "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80"}
                    alt={quest.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <Badge variant="category">{quest.category}</Badge>
                    <Badge variant={quest.difficulty as any}>{quest.difficulty}</Badge>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <Badge variant="xp">+{quest.xp_reward} XP</Badge>
                  </div>
                  {quest.source_type === 'ai_generated' && (
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-lime-300 font-mono font-bold">
                      ⚡ AI Generated
                    </div>
                  )}
                </div>

                <CardHeader>
                  <CardTitle className="text-base group-hover:text-forest-600 transition-colors">
                    {quest.title}
                  </CardTitle>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed line-clamp-2">
                    {quest.description}
                  </p>
                  <div className="flex items-center gap-2 pt-2 text-[11px] font-semibold text-text-muted">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{quest.duration_minutes} min outdoor time</span>
                  </div>
                </CardHeader>
              </div>

              <div className="p-6 pt-0">
                <Link to={`/app/quests/${quest.id}`}>
                  <Button variant="primary" size="sm" className="w-full justify-between">
                    <span>Inspect Mission</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
