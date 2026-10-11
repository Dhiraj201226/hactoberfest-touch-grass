import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, CheckCircle2, ShieldCheck, Camera, ArrowRight, Award, Footprints } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-ivory text-text-main flex flex-col selection:bg-forest-200">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-ivory/80 border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-800 text-forest-200 flex items-center justify-center shadow-soft-sm">
              <Compass className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-forest-900 block font-display">NatureQuest <span className="text-forest-500 font-medium">AI</span></span>
              <span className="text-[10px] tracking-wider text-text-muted uppercase font-semibold block -mt-1">Explore More, Scroll Less</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-forest-900">
            <a href="#how-it-works" className="hover:text-forest-600 transition-colors">How it Works</a>
            <a href="#neuraleye" className="hover:text-forest-600 transition-colors">NeuralEye™ AI</a>
            <a href="#gamification" className="hover:text-forest-600 transition-colors">Gamification</a>
            <a href="#manifesto" className="hover:text-forest-600 transition-colors">Manifesto</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm" className="shadow-soft-sm">Start Exploring</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-100 text-forest-800 border border-forest-200 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-forest-600" />
                <span>AI-Powered Real-World Exploration</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-black text-forest-900 tracking-tight leading-[1.08] font-display">
                Your Next Adventure <br />
                <span className="text-forest-500 underline decoration-forest-200 decoration-wavy decoration-2">Starts Outside.</span>
              </h1>
              <p className="text-lg sm:text-xl text-text-muted leading-relaxed max-w-2xl font-normal">
                Discover nature, complete real-world quests, and earn rewards for exploring the world around you. Designed specifically to get you off screens and deep into nature.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link to="/register">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto text-base shadow-soft-md">
                    Start Exploring Now <ArrowRight className="w-5 h-5 ml-1" />
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
                    How It Works
                  </Button>
                </a>
              </div>

              {/* Trust & Product Principles */}
              <div className="pt-6 border-t border-surface-border flex flex-wrap gap-6 text-xs text-text-muted font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest-500" />
                  <span>Real Outdoor Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-forest-500" />
                  <span>NeuralEye AI-Gen Filtering</span>
                </div>
                <div className="flex items-center gap-2">
                  <Footprints className="w-4 h-4 text-forest-500" />
                  <span>Put Phone in Pocket First</span>
                </div>
              </div>
            </div>

            {/* Interactive Preview Mockup Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-soft-lg border border-surface-border space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <Badge variant="category">Plants & Leaves</Badge>
                    <h3 className="font-bold text-lg text-forest-900">Leaf Pattern Detective</h3>
                    <p className="text-xs text-text-muted">Find 3 distinct leaf vein patterns in your local park</p>
                  </div>
                  <Badge variant="xp">+25 XP</Badge>
                </div>

                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-forest-900 border border-surface-border group">
                  <img
                    src="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80"
                    alt="Nature discovery"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <div className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-500/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>NeuralEye Verified Human</span>
                    </div>
                    <span className="text-[11px] font-mono opacity-80">99.4% genuine</span>
                  </div>
                </div>

                <div className="bg-forest-50 rounded-2xl p-4 border border-forest-100 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-forest-200 text-forest-900 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5 text-forest-800" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-forest-900">Level 4 Field Biologist</div>
                    <div className="text-[11px] text-text-muted">Streak: 6 days active outdoor time</div>
                  </div>
                  <span className="text-xs font-black text-forest-700">340 XP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-y border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold tracking-widest uppercase text-forest-500">Core Loop</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-forest-900 font-display">How NatureQuest Works</h3>
            <p className="text-text-muted text-base">Simple 4-step cycle designed to minimize screen addiction and maximize outdoor connection.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Choose Mission",
                desc: "Select a curated or open-source AI generated quest matching your time and local environment.",
                icon: Compass
              },
              {
                step: "02",
                title: "Pocket The Phone",
                desc: "Head outdoors without staring at a screen. Observe plants, clouds, fungi, or birds in reality.",
                icon: Footprints
              },
              {
                step: "03",
                title: "Capture Evidence",
                desc: "Snap a photo of the natural phenomenon you discovered adhering to ethical wildlife rules.",
                icon: Camera
              },
              {
                step: "04",
                title: "NeuralEye Verification",
                desc: "Our dual-layer engine checks for AI-generation synthesis and near-duplicate cheating.",
                icon: ShieldCheck
              }
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-ivory/60 border border-surface-border relative space-y-3">
                <span className="text-3xl font-black text-forest-200 font-display">{item.step}</span>
                <h4 className="font-bold text-forest-900 text-lg">{item.title}</h4>
                <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NeuralEye Deep-Dive */}
      <section id="neuraleye" className="py-20 bg-nature-pattern text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="lime" className="bg-forest-200 text-forest-900">Anti-Spoofing & Fair Play</Badge>
              <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight leading-tight">
                NeuralEye™ Multimodal AI Verification
              </h2>
              <p className="text-forest-100/90 leading-relaxed text-base">
                In an era of Midjourney and flux realism, gaming an outdoor quest by prompting synthetic images is trivial. NatureQuest incorporates <strong>NeuralEye</strong>, a dedicated media forensics adapter that inspects uploads for deepfake artifacts, diffusion noise patterns, cryptographic duplicate hashes, and quest-context relevance.
              </p>
              <ul className="space-y-3 text-sm text-forest-100">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-forest-200 flex-shrink-0" />
                  <span>SHA-256 and Perceptual image hashing prevents duplicate or recycled submissions</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-forest-200 flex-shrink-0" />
                  <span>Deepfake detection classifies synthetic vs genuine camera sensor capture</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-forest-200 flex-shrink-0" />
                  <span>Zero XP awarded on unverified submissions; human moderation fallback queue</span>
                </li>
              </ul>
            </div>

            <div className="bg-forest-900/80 backdrop-blur-md p-6 rounded-3xl border border-forest-600/40 space-y-4">
              <div className="flex items-center justify-between border-b border-forest-700 pb-3">
                <span className="text-xs font-mono text-forest-200">INSPECTION PIPELINE</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">STATUS: ACTIVE</span>
              </div>
              <div className="space-y-3 font-mono text-xs text-forest-100">
                <div className="p-3 bg-black/30 rounded-xl flex justify-between">
                  <span>1. SHA256 Signature:</span>
                  <span className="text-emerald-300">CLEAN (UNIQUE)</span>
                </div>
                <div className="p-3 bg-black/30 rounded-xl flex justify-between">
                  <span>2. Perceptual dHash:</span>
                  <span className="text-emerald-300">HAMMING DISTANCE &gt; 12</span>
                </div>
                <div className="p-3 bg-black/30 rounded-xl flex justify-between">
                  <span>3. NeuralEye Synthetic Check:</span>
                  <span className="text-forest-200 font-bold">GENUINE (0.94 CONFIDENCE)</span>
                </div>
                <div className="p-3 bg-black/30 rounded-xl flex justify-between">
                  <span>4. XP Ledger Execution:</span>
                  <span className="text-lime-300 font-bold">+25 XP AUTHORIZED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-forest-900 text-forest-300 py-12 border-t border-forest-800 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Compass className="w-5 h-5 text-forest-200" />
            <span className="text-white font-bold font-display">NatureQuest AI</span>
            <span className="text-xs text-forest-400">© 2026. Explore More, Scroll Less.</span>
          </div>
          <div className="flex gap-6 text-xs text-forest-300">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Ethical Outdoor Guidelines</a>
            <a href="https://github.com/Dhiraj201226/hactoberfest-touch-grass" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
