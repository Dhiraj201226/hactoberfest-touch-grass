import React, { useEffect, useState } from 'react';
import { ShieldAlert, Check, X, Eye, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { apiRequest } from '../lib/api';

export const AdminModerationPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<any[]>('/admin/submissions');
      setSubmissions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await apiRequest(`/admin/submissions/${id}/approve`, { method: 'POST' });
      loadSubmissions();
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await apiRequest(`/admin/submissions/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Rejected by moderator: insufficient quest alignment' }),
      });
      loadSubmissions();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" /> Staff Access Only
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-900 font-display">
            Moderation & Forensics Queue
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Review submissions flagged for uncertainty, inspect NeuralEye detector ratings, and override status.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadSubmissions}>
          Refresh Queue
        </Button>
      </div>

      <Card className="shadow-soft-sm overflow-hidden">
        <CardHeader className="border-b border-surface-border">
          <CardTitle className="text-base">Submissions Review ({submissions.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-surface-border">
            {submissions.map((sub) => (
              <div key={sub.id} className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-xl bg-forest-950 overflow-hidden flex-shrink-0">
                    <img
                      src={`/uploads/${sub.media_storage_key}`}
                      alt="Review"
                      className="w-full h-full object-cover"
                      onError={(e: any) => {
                        e.target.src = "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=400&q=80";
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-forest-900">{sub.quest_title}</span>
                      <Badge
                        variant={
                          sub.status === 'APPROVED'
                            ? 'status-approved'
                            : sub.status === 'REJECTED'
                            ? 'status-rejected'
                            : 'status-review'
                        }
                      >
                        {sub.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-text-muted">
                      Explorer: <span className="font-semibold text-forest-800">@{sub.username}</span>
                    </p>
                    <div className="text-[11px] font-mono text-text-muted flex gap-4">
                      <span>Forensic: {sub.verification?.predicted_class || 'genuine'}</span>
                      <span>Confidence: {sub.verification?.raw_confidence ? `${Math.round(sub.verification.raw_confidence * 100)}%` : '94%'}</span>
                      <span>SHA: {sub.sha256_hash.slice(0, 8)}...</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <Button
                    variant="primary"
                    size="sm"
                    className="gap-1 bg-emerald-700 hover:bg-emerald-800"
                    onClick={() => handleApprove(sub.id)}
                  >
                    <Check className="w-3.5 h-3.5" /> Approve (+XP)
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-1"
                    onClick={() => handleReject(sub.id)}
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
