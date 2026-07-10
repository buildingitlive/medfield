import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, X, Send, HelpCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface PrescriptionUploadScreenProps {
  onNavigate: (route: string) => void;
}

export const PrescriptionUploadScreen: React.FC<PrescriptionUploadScreenProps> = ({
  onNavigate,
}) => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setErrorMsg(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !user) return;
    setIsSubmitting(true);
    setErrorMsg(null);

    const fileExt = selectedFile.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('prescriptions')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      supabase.storage
        .from('prescriptions')
        .getPublicUrl(filePath); // Actually it's a private bucket, but we'll store the path instead

      const { error: dbError } = await supabase.from('prescriptions').insert({
        user_id: user.id,
        file_url: filePath,
        file_name: selectedFile.name,
        status: 'pending',
      } as any);

      if (dbError) throw dbError;

      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload prescription');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen pb-32 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => onNavigate('BACK')}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-on-surface hover:bg-surface-container rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button className="min-h-[44px] min-w-[44px] flex items-center justify-center text-on-surface hover:bg-surface-container rounded-full">
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

      {/* 3-Step Indicator matching Reference Design */}
      <div className="grid grid-cols-3 gap-2 mb-8 text-center">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold text-xs flex items-center justify-center mb-1.5 shadow-sm">
            1
          </div>
          <span className="text-[11px] font-bold text-primary">Upload</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-surface-container-high dark:bg-zinc-800 text-on-surface-variant font-bold text-xs flex items-center justify-center mb-1.5">
            2
          </div>
          <span className="text-[11px] font-semibold text-on-surface-variant">Review</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-surface-container-high dark:bg-zinc-800 text-on-surface-variant font-bold text-xs flex items-center justify-center mb-1.5">
            3
          </div>
          <span className="text-[11px] font-semibold text-on-surface-variant">Confirmed</span>
        </div>
      </div>

      <div className="mb-6 text-center sm:text-left">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface dark:text-zinc-100 mb-2">
          Upload your prescription
        </h1>
        <p className="text-xs text-on-surface-variant">
          Please provide a clear image of your valid prescription to proceed with your order.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-3 rounded-md bg-error-container/30 border border-error/20 text-xs text-error font-semibold text-center">
          {errorMsg}
        </div>
      )}

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dashed Upload Box matching Reference Design */}
          <div className="border-2 border-dashed border-outline-variant dark:border-zinc-700 rounded-brand p-8 text-center bg-surface-container-lowest dark:bg-zinc-900 relative">
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*,.pdf"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className="w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center mx-auto mb-4 shadow">
              <UploadCloud className="w-7 h-7" />
            </div>
            <h2 className="font-heading text-base font-bold text-on-surface dark:text-zinc-100 mb-1">
              Tap to upload or drag file
            </h2>
            <p className="text-xs text-on-surface-variant mb-5">
              Supported formats: JPG, PNG, PDF (Max 10MB)
            </p>
            <button
              type="button"
              className="min-h-[44px] px-6 rounded border border-primary text-primary font-semibold text-xs bg-surface dark:bg-zinc-800 pointer-events-none"
            >
              Browse Files
            </button>
          </div>

          {/* Preview Thumbnail if selected matching Reference Design */}
          {selectedFile && (
            <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-surface-variant shadow-sm bg-surface-container">
              <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-on-surface p-2 text-center break-all">
                {selectedFile.name}
              </div>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-error text-on-error flex items-center justify-center shadow"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Clarity Checklist matching Reference Design */}
          <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-on-surface dark:text-zinc-100 mb-1">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Clarity Checklist</span>
            </div>
            <div className="flex items-center gap-2.5 bg-surface-container-low dark:bg-zinc-800 p-3 rounded text-xs text-on-surface">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
              <span>Well-lit and easily readable</span>
            </div>
          </div>

          {/* Sticky Bottom Bar Submit Button */}
          <div className="fixed bottom-0 left-0 right-0 bg-surface-container-lowest dark:bg-zinc-900 border-t border-surface-variant dark:border-zinc-800 p-4 pb-safe z-40 shadow-lg">
            <div className="max-w-2xl mx-auto">
              <button
                type="submit"
                disabled={!selectedFile || isSubmitting}
                className="w-full min-h-[48px] bg-primary text-on-primary font-semibold rounded-md flex items-center justify-center gap-2 shadow disabled:opacity-50 text-sm transition-all"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isSubmitting ? 'Uploading & Verifying...' : 'Submit Prescription'}
                </span>
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant p-8 rounded-brand text-center my-8 shadow-sm">
          <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" />
          <h2 className="font-heading text-xl font-bold text-on-surface mb-2">
            Prescription Uploaded Successfully!
          </h2>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto mb-6">
            Our pharmacy team is reviewing your prescription. Once verified, your order will be dispatched for delivery.
          </p>
          <button
            onClick={() => onNavigate('/cart')}
            className="min-h-[44px] px-6 rounded bg-primary text-on-primary text-xs font-semibold shadow"
          >
            Proceed to Cart
          </button>
        </div>
      )}
    </main>
  );
};
