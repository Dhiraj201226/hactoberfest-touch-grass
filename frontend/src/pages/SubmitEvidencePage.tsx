import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Upload, Camera, ShieldCheck, AlertCircle, FileCheck2, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { apiRequest } from '../lib/api';
import { Submission } from '../types';

export const SubmitEvidencePage: React.FC = () => {
  const { questId } = useParams<{ questId: string }>();
  const [searchParams] = useSearchParams();
  const attemptId = searchParams.get('attempt');
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select or photograph an image for evidence.');
      return;
    }
    if (!attemptId) {
      setError('Missing quest attempt session. Please restart the quest.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('quest_attempt_id', attemptId);
      formData.append('description', description);
      formData.append('file', file);

      const submission = await apiRequest<Submission>('/submissions', {
        method: 'POST',
        body: formData,
      });

      // Navigate to verification results view
      navigate(`/app/submissions/${submission.id}`);
    } catch (err: any) {
      setError(err.message || 'Evidence submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-900 font-display">
          Submit Outdoor Evidence
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Upload your camera capture. NeuralEye will inspect the file for authentic optical capture and duplicate markers.
        </p>
      </div>

      <Card className="shadow-soft-md">
        <CardHeader>
          <CardTitle>Evidence Photo & Observation</CardTitle>
          <CardDescription>
            Supported formats: JPEG, PNG, WebP (Max 15MB). Genuine outdoor captures only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-earth-error text-xs font-semibold">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload Dropzone */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider">
                Photo Discovery
              </label>

              <div className="relative border-2 border-dashed border-forest-200 hover:border-forest-500 rounded-2xl p-6 text-center bg-forest-50/40 transition-colors cursor-pointer group">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                {preview ? (
                  <div className="relative rounded-xl overflow-hidden max-h-72 mx-auto">
                    <img src={preview} alt="Upload preview" className="w-full h-full object-contain mx-auto" />
                    <div className="mt-3 text-xs font-semibold text-forest-700">
                      Tap or drag another file to replace
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 py-4">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-soft-sm mx-auto flex items-center justify-center text-forest-700 group-hover:scale-105 transition-transform">
                      <Camera className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-forest-900">Take a photo or choose file</p>
                      <p className="text-xs text-text-muted mt-0.5">JPEG, PNG or WebP up to 15MB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Observation Notes */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider">
                Field Observation Notes (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="What did you observe? e.g., 'Found on the north face of an oak tree near the creek.'"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-surface-border text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-forest-500 shadow-sm"
              />
            </div>

            {/* NeuralEye Forensics Guarantee */}
            <div className="p-3.5 bg-forest-50 border border-forest-100 rounded-xl flex items-center gap-3 text-xs text-forest-800">
              <ShieldCheck className="w-5 h-5 text-forest-600 flex-shrink-0" />
              <div>
                <strong>NeuralEye AI Forensics Active:</strong> Synthesized deepfakes or recycled screenshots are rejected. XP is credited only once upon successful verification.
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full text-base font-bold shadow-soft-md"
              loading={loading}
            >
              Verify & Submit Evidence
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
