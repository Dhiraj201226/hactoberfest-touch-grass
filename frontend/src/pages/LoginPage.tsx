import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Mail, Lock, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await apiRequest<{ access_token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      login(data.access_token, data.user);
      if (!data.user.onboarding_completed) {
        navigate('/onboarding');
      } else {
        navigate('/app');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-4 selection:bg-forest-200">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 text-forest-900 group">
            <div className="w-10 h-10 rounded-xl bg-forest-800 text-forest-200 flex items-center justify-center shadow-soft-sm group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 stroke-[2.2]" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight font-display">NatureQuest <span className="text-forest-500 font-medium">AI</span></span>
          </Link>
          <p className="text-xs uppercase tracking-widest font-semibold text-text-muted">Welcome Back Explorer</p>
        </div>

        <Card className="shadow-soft-md">
          <CardHeader>
            <CardTitle>Sign in to your account</CardTitle>
            <CardDescription>Enter your email and password to resume your outdoor quests.</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-earth-error text-xs font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="ranger@naturequest.app"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-muted">Demo: demo@naturequest.app / secret123</span>
                <Link to="/forgot-password" className="text-forest-700 hover:underline font-semibold">Forgot?</Link>
              </div>
              <Button type="submit" variant="primary" size="lg" className="w-full mt-2" loading={loading}>
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-text-muted">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-forest-700 hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};
