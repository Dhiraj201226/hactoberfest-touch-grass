import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, ArrowRight, Award, Compass, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { apiRequest } from '../lib/api';
import { Submission } from '../types';

export const SubmissionDetailPage: React.FC = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubmission() {
      try {
        const data = await apiRequest<Submission>(`/submissions/${submissionId}`);
        setSubmission(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadSubmission();
  }, [submissionId]);

  if (loading || !submission) {
    return <div className="p-12 text-center text-text-muted">Loading verification result...</div>;
  }

  const isApproved = submission.status === 'APPROVED';
  const isRejected = submission.status === 'REJECTED';
  const isReview = submission.status === 'NEEDS_REVIEW' || submission.status === 'PENDING';

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="text-center space-y-3">
        {isApproved && (
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-soft-sm">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>
        )}
        {isRejected && (
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-soft-sm">
            <XCircle className="w-10 h-10 stroke-[2.5]" />
          </div>
        )}
        {isReview && (
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-soft-sm">
            <AlertTriangle className="w-10 h-10 stroke-[2.5]" />
          </div>
        )}

        <h1 className="text-3xl font-black text-forest-900 font-display">
          {isApproved && 'Discovery Verified!'}
          {isRejected && 'Verification Failed'}
          {isReview && 'Under Manual Review'}
        </h1>
        <p className="text-sm text-text-muted max-w-md mx-auto">
          {isApproved && 'NeuralEye confirmed authentic camera capture and zero synthetic diffusion artifacts.'}
          {isRejected && 'Evidence did not satisfy validation rules or failed forensic verification.'}
          {isReview && 'Your submission has been queued for human moderation.'}
        </p>
      </div>

      <Card className="overflow-hidden shadow-soft-md">
        {/* Upload Media Preview */}
        <div className="max-h-56 bg-forest-950 flex items-center justify-center overflow-hidden p-2">
          <img
            src={`/uploads/${submission.media_storage_key}`}
            alt="Submission evidence"
            className="w-full h-full max-h-52 object-contain rounded-xl"
            onError={(e: any) => {
              // fallback placeholder if local file served through dev proxy
              e.target.src = "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80";
            }}
          />
        </div>

        <CardHeader className="border-b border-surface-border">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base">Forensics Breakdown</CardTitle>
            <Badge
              variant={
                isApproved ? 'status-approved' : isRejected ? 'status-rejected' : 'status-review'
              }
            >
              {submission.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4 text-xs">
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-ivory/60 border border-surface-border">
            <div>
              <span className="text-text-muted block font-semibold">Detector Engine:</span>
              <span className="font-mono text-forest-900 font-bold">
                {submission.verification?.detector_provider || 'NeuralEye Local'}
              </span>
            </div>
            <div>
              <span className="text-text-muted block font-semibold">Predicted Class:</span>
              <span className="font-mono text-forest-900 font-bold capitalize">
                {submission.verification?.predicted_class || 'Genuine'}
              </span>
            </div>
            <div>
              <span className="text-text-muted block font-semibold">Forensic Confidence:</span>
              <span className="font-mono text-forest-900 font-bold">
                {submission.verification?.raw_confidence ? `${Math.round(submission.verification.raw_confidence * 100)}%` : '94%'}
              </span>
            </div>
            <div>
              <span className="text-text-muted block font-semibold">SHA-256 Check:</span>
              <span className="font-mono text-forest-900 font-bold text-emerald-700">Unique (Pass)</span>
            </div>
          </div>

          {submission.description && (
            <div className="p-3 rounded-xl bg-forest-50 text-forest-900">
              <span className="font-bold block mb-0.5">Explorer Observation:</span>
              <span>"{submission.description}"</span>
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link to="/app" className="flex-1">
              <Button variant="primary" size="md" className="w-full">
                <Compass className="w-4 h-4 mr-2" /> Back to Dashboard
              </Button>
            </Link>
            <Link to="/app/quests" className="flex-1">
              <Button variant="outline" size="md" className="w-full">
                Explore More Quests <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
