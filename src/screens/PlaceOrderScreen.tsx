import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  UploadCloud,
  Plus,
  X,
  Loader2,
  FileText,
  Pill,
  MapPin,
  CheckCircle2,
  Send,
  ChevronRight,
  StickyNote,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAddresses } from '../hooks/useAddresses';
import { useOrders } from '../hooks/useOrders';
import { usePrescriptions } from '../hooks/usePrescriptions';
import { supabase } from '../lib/supabase';

interface PlaceOrderScreenProps {
  onNavigate: (route: string) => void;
  /** Pre-selected medicines when reordering from a prescription */
  reorderData?: {
    prescriptionId: string;
    medicines: { name: string; quantity: number }[];
  } | null;
}

type Step = 1 | 2 | 3;

interface MedicineRow {
  id: string;
  name: string;
  quantity: number;
}

export const PlaceOrderScreen: React.FC<PlaceOrderScreenProps> = ({
  onNavigate,
  reorderData,
}) => {
  const { user } = useAuth();
  const { defaultAddress, addresses } = useAddresses();
  const { placeOrderRequest } = useOrders();
  const { createPrescription } = usePrescriptions();

  // If reordering, skip directly to step 3
  const initialStep: Step = reorderData ? 3 : 1;
  const [currentStep, setCurrentStep] = useState<Step>(initialStep);

  // Step 1: Prescription upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2: Medicine list
  const [patientName, setPatientName] = useState('');
  const [medicines, setMedicines] = useState<MedicineRow[]>(
    reorderData?.medicines.map((m, i) => ({
      id: `reorder-${i}`,
      name: m.name,
      quantity: m.quantity,
    })) || [{ id: '1', name: '', quantity: 1 }]
  );
  const [orderNotes, setOrderNotes] = useState('');

  // Step 3: Address
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    defaultAddress?.id || null
  );

  // General
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const steps = [
    { num: 1, label: 'Prescription', icon: FileText },
    { num: 2, label: 'Medicines', icon: Pill },
    { num: 3, label: 'Address', icon: MapPin },
  ];

  // ─── File handling ─────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setErrorMsg(null);
    }
  };

  const uploadPrescription = async (): Promise<string | null> => {
    if (!selectedFile || !user) return null;

    const fileExt = selectedFile.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error } = await supabase.storage
      .from('prescriptions')
      .upload(filePath, selectedFile);

    if (error) {
      setErrorMsg('Failed to upload prescription: ' + error.message);
      return null;
    }

    return filePath;
  };

  // ─── Medicine row management ───────────────────
  const addMedicineRow = () => {
    setMedicines((prev) => [
      ...prev,
      { id: Date.now().toString(), name: '', quantity: 1 },
    ]);
  };

  const removeMedicineRow = (id: string) => {
    if (medicines.length <= 1) return;
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  const updateMedicine = (id: string, field: 'name' | 'quantity', value: string | number) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  // ─── Step navigation ───────────────────────────
  const goToStep2 = async () => {
    // Upload file if selected
    if (selectedFile) {
      setIsSubmitting(true);
      const url = await uploadPrescription();
      setIsSubmitting(false);
      if (url) setUploadedUrl(url);
    }
    setCurrentStep(2);
  };

  const goToStep3 = () => {
    // Validate at least one medicine has a name
    const validMeds = medicines.filter((m) => m.name.trim() !== '');
    if (validMeds.length === 0 && !uploadedUrl) {
      setErrorMsg('Please add at least one medicine or upload a prescription.');
      return;
    }
    setErrorMsg(null);
    setCurrentStep(3);
  };

  // ─── Final submission ──────────────────────────
  const handlePlaceOrder = async () => {
    const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || defaultAddress;
    if (!selectedAddress) {
      setErrorMsg('Please select a delivery address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    // Build medicine text
    const validMeds = reorderData?.medicines || medicines.filter((m) => m.name.trim() !== '');
    const medicineText = validMeds
      .map((m) => `${m.name} × ${m.quantity}`)
      .join('\n');

    // Save prescription to history
    let prescriptionId = reorderData?.prescriptionId || null;
    if (!prescriptionId && (validMeds.length > 0 || uploadedUrl)) {
      const { prescriptionId: newRxId } = await createPrescription({
        patientName: patientName || 'Self',
        prescriptionUrl: uploadedUrl,
        notes: orderNotes || null,
        medicines: validMeds.map((m) => ({ name: m.name, quantity: m.quantity })),
      });
      prescriptionId = newRxId;
    }

    const { error, orderId } = await placeOrderRequest({
      address: selectedAddress,
      prescriptionId,
      prescriptionUrl: uploadedUrl,
      medicineText: medicineText || null,
      notes: orderNotes || null,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMsg(error);
    } else {
      onNavigate(`/order-success/${orderId}`);
    }
  };

  // ─── Render ────────────────────────────────────
  return (
    <main className="min-h-screen pb-44 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      {/* Top Bar */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => {
            if (currentStep > 1 && !reorderData) {
              setCurrentStep((s) => (s - 1) as Step);
            } else {
              onNavigate('BACK');
            }
          }}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-on-surface hover:bg-surface-container rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-heading text-2xl font-bold text-primary dark:text-emerald-400">
          {reorderData ? 'Reorder' : 'Place Order'}
        </h1>
      </div>

      {/* Step Indicator */}
      {!reorderData && (
        <div className="grid grid-cols-3 gap-2 mb-8 text-center">
          {steps.map((step) => {
            const isActive = currentStep === step.num;
            const isCompleted = currentStep > step.num;
            const StepIcon = step.icon;
            return (
              <div key={step.num} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-1.5 shadow-sm transition-all ${
                    isActive
                      ? 'bg-primary text-on-primary scale-110'
                      : isCompleted
                      ? 'bg-primary/20 text-primary'
                      : 'bg-surface-container-high dark:bg-zinc-800 text-on-surface-variant'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={`text-[11px] font-semibold ${
                    isActive ? 'text-primary font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {errorMsg && (
        <div className="w-full mb-4 p-3 rounded-md bg-error-container/30 border border-error/20 text-xs text-error font-semibold text-center">
          {errorMsg}
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* STEP 1: Upload Prescription                */}
      {/* ═══════════════════════════════════════════ */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-in fade-in">
          <div className="text-center sm:text-left">
            <h2 className="font-heading text-xl font-bold text-on-surface dark:text-zinc-100 mb-1">
              Upload your prescription
            </h2>
            <p className="text-xs text-on-surface-variant">
              Upload a clear image of your prescription, or skip to list medicines manually.
            </p>
          </div>

          {/* Upload Box */}
          <div className="border-2 border-dashed border-outline-variant dark:border-zinc-700 rounded-2xl p-8 text-center bg-surface-container-lowest dark:bg-zinc-900 relative">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept="image/*,.pdf"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className="w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center mx-auto mb-4 shadow">
              <UploadCloud className="w-7 h-7" />
            </div>
            <h3 className="font-heading text-base font-bold text-on-surface dark:text-zinc-100 mb-1">
              Tap to upload or drag file
            </h3>
            <p className="text-xs text-on-surface-variant mb-5">
              Supported: JPG, PNG, PDF (Max 10MB)
            </p>
            <button
              type="button"
              className="min-h-[44px] px-6 rounded border border-primary text-primary font-semibold text-xs pointer-events-none"
            >
              Browse Files
            </button>
          </div>

          {/* Preview */}
          {selectedFile && (
            <div className="relative inline-block">
              <div className="w-full max-w-xs rounded-xl overflow-hidden border-2 border-primary/30 shadow-md bg-surface-container">
                {selectedFile.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Prescription preview"
                    className="w-full max-h-48 object-contain bg-white"
                  />
                ) : (
                  <div className="w-full h-32 flex flex-col items-center justify-center gap-2 p-4">
                    <FileText className="w-8 h-8 text-primary" />
                    <span className="text-xs font-semibold text-on-surface text-center break-all">{selectedFile.name}</span>
                  </div>
                )}
                <div className="px-3 py-2 bg-primary/5 flex items-center justify-between gap-2">
                  <p className="text-[11px] font-medium text-on-surface-variant truncate flex-1">{selectedFile.name}</p>
                  <button
                    type="button"
                    onClick={() => { setSelectedFile(null); setUploadedUrl(null); }}
                    className="min-h-[28px] min-w-[28px] rounded-full bg-error/10 text-error flex items-center justify-center hover:bg-error/20 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={goToStep2}
              disabled={isSubmitting}
              className="w-full min-h-[48px] bg-primary text-on-primary font-semibold rounded-md flex items-center justify-center gap-2 shadow text-sm transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{selectedFile ? 'Upload & Continue' : 'Continue without Prescription'}</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* STEP 2: List Medicines                     */}
      {/* ═══════════════════════════════════════════ */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h2 className="font-heading text-xl font-bold text-on-surface dark:text-zinc-100 mb-1">
              What do you need?
            </h2>
            <p className="text-xs text-on-surface-variant">
              List the medicines you'd like to order. Our pharmacist will verify and confirm pricing.
            </p>
          </div>

          {/* Patient Name */}
          <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
              Patient Name
            </label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. Self, Mom, Dad..."
              className="w-full min-h-[44px] px-3 rounded-lg border border-outline-variant bg-surface dark:bg-zinc-800 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Medicine Rows */}
          <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Pill className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-on-surface dark:text-zinc-100">Medicines</span>
            </div>

            {medicines.map((med, idx) => (
              <div key={med.id} className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs text-on-surface-variant w-4 sm:w-5 flex-shrink-0 text-center font-bold">
                  {idx + 1}.
                </span>
                <input
                  type="text"
                  value={med.name}
                  onChange={(e) => updateMedicine(med.id, 'name', e.target.value)}
                  placeholder="Medicine name"
                  className="flex-1 min-w-0 min-h-[44px] px-3 rounded-xl border border-outline-variant bg-surface dark:bg-zinc-800 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors"
                />
                <input
                  type="number"
                  min="1"
                  value={med.quantity}
                  onChange={(e) =>
                    updateMedicine(med.id, 'quantity', parseInt(e.target.value) || 1)
                  }
                  className="w-14 sm:w-16 flex-shrink-0 min-h-[44px] px-1 text-center rounded-xl border border-outline-variant bg-surface dark:bg-zinc-800 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
                {medicines.length > 1 && (
                  <button
                    onClick={() => removeMedicineRow(med.id)}
                    className="w-8 h-8 flex-shrink-0 rounded-full text-error hover:bg-error/10 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={addMedicineRow}
              className="w-full min-h-[40px] border border-dashed border-primary/40 text-primary font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 hover:bg-primary/5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Medicine</span>
            </button>
          </div>

          {/* Notes */}
          <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <StickyNote className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-on-surface dark:text-zinc-100">
                Note for Pharmacist (optional)
              </span>
            </div>
            <textarea
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder="e.g. Need generic alternatives if available, or deliver after 5 PM..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface dark:bg-zinc-800 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          {/* Pharmacist reassurance */}
          <div className="flex items-start gap-3 bg-primary/5 border border-primary/10 rounded-xl p-4">
            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-on-surface dark:text-zinc-100">
                Your order will be reviewed by our pharmacist
              </p>
              <p className="text-xs text-on-surface-variant mt-0.5">
                They'll verify medicines, check availability, and confirm the final price before your order is processed.
              </p>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={goToStep3}
            className="w-full min-h-[48px] bg-primary text-on-primary font-semibold rounded-md flex items-center justify-center gap-2 shadow text-sm transition-all"
          >
            <span>Continue to Address</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* STEP 3: Select Address & Place Order       */}
      {/* ═══════════════════════════════════════════ */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h2 className="font-heading text-xl font-bold text-on-surface dark:text-zinc-100 mb-1">
              Delivery Address
            </h2>
            <p className="text-xs text-on-surface-variant">
              Select where you'd like your medicines delivered.
            </p>
          </div>

          {/* Address Cards */}
          {addresses.length === 0 ? (
            <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant rounded-2xl p-6 text-center shadow-sm">
              <MapPin className="w-8 h-8 text-outline-variant mx-auto mb-2" />
              <p className="text-sm font-semibold text-on-surface mb-3">No saved addresses</p>
              <button
                onClick={() => onNavigate('/addresses')}
                className="min-h-[44px] px-6 rounded-md bg-primary text-on-primary text-xs font-semibold shadow"
              >
                Add Address
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => {
                const isSelected = addr.id === selectedAddressId;
                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer bg-surface-container-lowest dark:bg-zinc-900 ${
                      isSelected
                        ? 'border-primary border-2 shadow-md'
                        : 'border-surface-variant dark:border-zinc-800 hover:border-outline'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                          isSelected ? 'border-primary' : 'border-outline-variant'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-on-surface dark:text-zinc-100">
                            {addr.recipient_name || 'Address'}
                          </span>
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-surface-container dark:bg-zinc-800 text-on-surface-variant">
                            {addr.label}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                          {addr.street}
                          <br />
                          {addr.city}, {addr.state} {addr.zip}
                          <br />
                          Phone: {addr.phone || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              <button
                onClick={() => onNavigate('/addresses')}
                className="w-full min-h-[44px] border border-dashed border-primary/40 text-primary font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 hover:bg-primary/5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Address</span>
              </button>
            </div>
          )}

          {/* Order Summary Preview */}
          {!reorderData && (
            <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
              <h3 className="text-xs font-bold text-on-surface dark:text-zinc-100 mb-3">
                Order Summary
              </h3>
              {uploadedUrl && (
                <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span>Prescription uploaded</span>
                </div>
              )}
              {medicines.filter((m) => m.name.trim()).length > 0 && (
                <div className="space-y-1">
                  {medicines
                    .filter((m) => m.name.trim())
                    .map((m, i) => (
                      <div key={i} className="flex items-center justify-between text-xs text-on-surface-variant">
                        <span>{m.name}</span>
                        <span className="font-semibold">× {m.quantity}</span>
                      </div>
                    ))}
                </div>
              )}
              {patientName && (
                <div className="mt-2 text-xs text-on-surface-variant">
                  Patient: <span className="font-semibold">{patientName}</span>
                </div>
              )}
            </div>
          )}

          {/* Place Order */}
          <div className="fixed bottom-16 lg:bottom-0 left-0 right-0 bg-surface-container-lowest dark:bg-zinc-900 border-t border-surface-variant dark:border-zinc-800 p-4 pb-safe z-40 shadow-lg">
            <div className="max-w-2xl mx-auto flex flex-col gap-2">
              <p className="text-[10px] text-on-surface-variant text-center">
                💊 Pricing will be confirmed by our pharmacist after review
              </p>
              <button
                onClick={handlePlaceOrder}
                disabled={!selectedAddressId || isSubmitting}
                className="w-full min-h-[48px] bg-primary hover:bg-primary-container text-on-primary font-semibold rounded-md flex items-center justify-center gap-2 shadow text-sm transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Place Order</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
