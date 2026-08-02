import React, { useState } from 'react';
import { FileText, Pill, Calendar, ChevronRight, Loader2, CheckSquare, Square, ArrowRight, Trash2, FileImage, X } from 'lucide-react';
import { usePrescriptions } from '../hooks/usePrescriptions';
import { supabase } from '../lib/supabase';
import type { PrescriptionWithItems } from '../types/database';

interface PrescriptionsScreenProps {
  onNavigate: (route: string) => void;
  onReorder?: (data: { prescriptionId: string; medicines: { name: string; quantity: number }[] }) => void;
}

export const PrescriptionsScreen: React.FC<PrescriptionsScreenProps> = ({
  onNavigate,
  onReorder,
}) => {
  const { prescriptions, loading, deletePrescription } = usePrescriptions();
  const [selectedRx, setSelectedRx] = useState<PrescriptionWithItems | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [imageModal, setImageModal] = useState<string | null>(null);
  const [deleteConfirmRx, setDeleteConfirmRx] = useState<PrescriptionWithItems | null>(null);

  const openPrescription = (rx: PrescriptionWithItems) => {
    setSelectedRx(rx);
    setCheckedItems(new Set(rx.items.map((item) => item.id)));
  };

  const closePrescription = () => {
    setSelectedRx(null);
    setCheckedItems(new Set());
  };

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleReorder = () => {
    if (!selectedRx) return;
    const selectedMeds = selectedRx.items
      .filter((item) => checkedItems.has(item.id))
      .map((item) => ({ name: item.medicine_name, quantity: item.quantity }));
    if (selectedMeds.length === 0) return;
    if (onReorder) onReorder({ prescriptionId: selectedRx.id, medicines: selectedMeds });
  };

  const handleDelete = (rx: PrescriptionWithItems, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDeleteConfirmRx(rx);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmRx) return;
    const rx = deleteConfirmRx;
    setDeleteConfirmRx(null);
    setDeletingId(rx.id);
    const { error } = await deletePrescription(rx.id, rx.prescription_url);
    setDeletingId(null);
    if (error) {
      alert('Failed to delete: ' + error);
    } else if (selectedRx?.id === rx.id) {
      closePrescription();
    }
  };

  const getPrescriptionImageUrl = (path: string) =>
    supabase.storage.from('prescriptions').getPublicUrl(path).data.publicUrl;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

  // ─── Delete Confirmation Modal ─────────────────
  const renderDeleteModal = () => {
    if (!deleteConfirmRx) return null;
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setDeleteConfirmRx(null)}>
        <div
          className="bg-surface-container-lowest dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-6 h-6 text-error" />
          </div>
          <h3 className="text-lg font-bold text-on-surface dark:text-zinc-100 text-center mb-2">
            Delete Prescription?
          </h3>
          <p className="text-sm text-on-surface-variant text-center mb-6">
            This will permanently delete <span className="font-semibold text-on-surface">{deleteConfirmRx.patient_name}&apos;s</span> prescription
            {deleteConfirmRx.items.length > 0 && ` with ${deleteConfirmRx.items.length} medicine${deleteConfirmRx.items.length !== 1 ? 's' : ''}`}.
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteConfirmRx(null)}
              className="flex-1 min-h-[44px] rounded-xl border border-surface-variant dark:border-zinc-700 text-on-surface dark:text-zinc-100 font-semibold text-sm hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 min-h-[44px] rounded-xl bg-error text-white font-semibold text-sm hover:bg-error/90 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ─── Full-Screen Image Modal ──────────────────
  if (imageModal) {
    return (
      <>
        {renderDeleteModal()}
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setImageModal(null)}>
          <button
            onClick={() => setImageModal(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={imageModal}
            alt="Prescription"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </>
    );
  }

  // ─── Prescription Detail View ──────────────────
  if (selectedRx) {
    return (
      <>
        {renderDeleteModal()}
        <main className="min-h-screen pb-44 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <button
            onClick={closePrescription}
            className="text-xs font-semibold text-primary hover:underline mb-4 inline-flex items-center gap-1"
          >
            ← Back to Prescriptions
          </button>

          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="font-heading text-2xl font-bold text-on-surface dark:text-zinc-100 mb-1">
                {selectedRx.patient_name}&apos;s Prescription
              </h1>
              <p className="text-xs text-on-surface-variant">
                <Calendar className="w-3.5 h-3.5 inline mr-1" />
                {formatDate(selectedRx.created_at)}
              </p>
            </div>
            <button
              onClick={() => handleDelete(selectedRx)}
              disabled={deletingId === selectedRx.id}
              className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg border border-error/30 text-error hover:bg-error/10 transition-colors disabled:opacity-50"
              title="Delete prescription"
            >
              {deletingId === selectedRx.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Prescription Image */}
          {selectedRx.prescription_url && (
            <div className="mb-6 bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-on-surface dark:text-zinc-100 mb-3">
                <FileImage className="w-4 h-4 text-primary" />
                Prescription Media
              </div>
              <div className="flex flex-wrap gap-3">
                {selectedRx.prescription_url.split(',').map((url, idx) => (
                  <div key={idx} className="relative w-full max-w-[200px]">
                    <div
                      className="rounded-xl overflow-hidden border border-surface-variant bg-white cursor-pointer hover:opacity-90 transition-opacity h-32"
                      onClick={() => url.toLowerCase().endsWith('.pdf') ? window.open(getPrescriptionImageUrl(url), '_blank') : setImageModal(getPrescriptionImageUrl(url))}
                    >
                      {url.toLowerCase().endsWith('.pdf') ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-100 text-zinc-500">
                          <span className="font-bold text-sm">PDF</span>
                        </div>
                      ) : (
                        <img
                          src={getPrescriptionImageUrl(url)}
                          alt={`Prescription ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-on-surface-variant mt-2">Tap an image to view full size</p>
            </div>
          )}

          {/* Medicine List with Checkboxes */}
          <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-2xl p-4 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-on-surface dark:text-zinc-100">
                <Pill className="w-4 h-4 text-primary" />
                Medicines
              </div>
              <span className="text-[10px] text-on-surface-variant">
                {checkedItems.size} of {selectedRx.items.length} selected
              </span>
            </div>

            {selectedRx.items.length === 0 ? (
              <p className="text-sm text-on-surface-variant text-center py-4">
                No medicines listed for this prescription.
              </p>
            ) : (
              <div className="space-y-2">
                {selectedRx.items.map((item) => {
                  const isChecked = checkedItems.has(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-primary/5 border-primary/30'
                          : 'bg-surface dark:bg-zinc-800 border-surface-variant dark:border-zinc-700 opacity-60'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-primary flex-shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-outline-variant flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${isChecked ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                          {item.medicine_name}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-on-surface-variant bg-surface-container dark:bg-zinc-700 px-2 py-1 rounded-full">
                        × {item.quantity}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notes */}
          {selectedRx.notes && (
            <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-2xl p-4 shadow-sm mb-6">
              <p className="text-xs font-bold text-on-surface dark:text-zinc-100 mb-1">Notes</p>
              <p className="text-xs text-on-surface-variant">{selectedRx.notes}</p>
            </div>
          )}

          {/* Sticky Reorder Button */}
          {selectedRx.items.length > 0 && (
            <div className="fixed bottom-16 lg:bottom-0 left-0 right-0 bg-surface-container-lowest dark:bg-zinc-900 border-t border-surface-variant dark:border-zinc-800 p-4 pb-safe z-40 shadow-lg">
              <div className="max-w-2xl mx-auto">
                <button
                  onClick={handleReorder}
                  disabled={checkedItems.size === 0}
                  className="w-full min-h-[48px] bg-primary hover:bg-primary-container text-on-primary font-semibold rounded-md flex items-center justify-center gap-2 shadow text-sm transition-all disabled:opacity-40"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Reorder {checkedItems.size} Medicine{checkedItems.size !== 1 ? 's' : ''}</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </>
    );
  }

  // ─── Prescription List View ────────────────────
  return (
    <>
      {renderDeleteModal()}
      <main className="min-h-screen pb-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="mb-6">
          <h1 className="font-heading text-3xl font-bold text-on-surface dark:text-zinc-100 mb-1">
            Prescriptions
          </h1>
          <p className="text-xs text-on-surface-variant dark:text-zinc-400">
            Your saved prescriptions. Tap to reorder medicines instantly.
          </p>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="p-12 text-center bg-surface-container-lowest dark:bg-zinc-900 rounded-2xl border border-surface-variant shadow-sm">
            <FileText className="w-12 h-12 text-outline-variant mx-auto mb-3" />
            <p className="text-sm font-semibold text-on-surface mb-1">No prescriptions yet</p>
            <p className="text-xs text-on-surface-variant mb-4">
              Your prescriptions will appear here after you place your first order.
            </p>
            <button
              onClick={() => onNavigate('/place-order')}
              className="min-h-[44px] px-6 rounded-md bg-primary text-on-primary text-xs font-semibold shadow"
            >
              Place Your First Order
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {prescriptions.map((rx) => {
              const medNames = rx.items.map((i) => i.medicine_name);
              const displayMeds =
                medNames.length <= 3
                  ? medNames.join(', ')
                  : `${medNames.slice(0, 3).join(', ')} +${medNames.length - 3} more`;

              return (
                <div
                  key={rx.id}
                  className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-2xl shadow-sm cursor-pointer hover:border-primary/50 transition-all group"
                >
                  <div className="p-4 flex items-start gap-3" onClick={() => openPrescription(rx)}>
                    {/* Prescription Thumbnail */}
                    {rx.prescription_url ? (
                      <div className="flex gap-1 -space-x-4 flex-shrink-0">
                        {rx.prescription_url.split(',').slice(0, 3).map((url, idx) => (
                          <div key={idx} className="w-14 h-14 rounded-lg overflow-hidden border-2 border-surface-container-lowest bg-white z-10" style={{ zIndex: 10 - idx }}>
                            {url.toLowerCase().endsWith('.pdf') ? (
                              <div className="w-full h-full flex items-center justify-center bg-zinc-100">
                                <span className="text-[10px] font-bold text-zinc-500">PDF</span>
                              </div>
                            ) : (
                              <img
                                src={getPrescriptionImageUrl(url)}
                                alt="Rx"
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                        <Pill className="w-6 h-6 text-primary/40" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-on-surface dark:text-zinc-100">
                          {rx.patient_name}
                        </span>
                        {rx.prescription_url && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            📄 Rx
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-on-surface-variant mb-2">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {formatDate(rx.created_at)}
                      </p>
                      {rx.items.length > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                          <Pill className="w-3.5 h-3.5 text-primary" />
                          <span>{displayMeds}</span>
                        </div>
                      )}
                    </div>

                    <ChevronRight className="w-5 h-5 text-outline-variant group-hover:text-primary transition-colors mt-1 flex-shrink-0" />
                  </div>

                  {/* Delete Button */}
                  <div className="px-4 pb-3 pt-0 flex justify-end">
                    <button
                      onClick={(e) => handleDelete(rx, e)}
                      disabled={deletingId === rx.id}
                      className="text-[11px] text-error/70 hover:text-error font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
                    >
                      {deletingId === rx.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
};
