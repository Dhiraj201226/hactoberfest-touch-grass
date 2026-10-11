import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';

export const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
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
      const data = await apiRequest<{ access_token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username,
          display_name: displayName || username,
          email,
          password,
        }),
      });
      login(data.access_token, data.user);
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check inputs.');
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
          <p className="text-xs uppercase tracking-widest font-semibold text-text-muted">Join The Outdoor Movement</p>
        </div>

        <Card className="shadow-soft-md">
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>Step outside, record genuine nature observations, and build streaks.</CardDescription>
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
                label="Username"
                type="text"
                placeholder="trail_runner"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                label="Display Name"
                type="text"
                placeholder="Alex Rivera"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <Input
                label="Email address"
                type="email"
                placeholder="alex@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Minimum 6 characters"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" variant="primary" size="lg" className="w-full mt-2" loading={loading}>
                Join NatureQuest
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-forest-700 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
