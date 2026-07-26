import React from 'react';
import { ArrowLeft, XCircle, Ban, RefreshCw, MessageSquare, Package, AlertTriangle, Mail } from 'lucide-react';

interface RefundPolicyScreenProps {
  onNavigate: (route: string) => void;
}

export const RefundPolicyScreen: React.FC<RefundPolicyScreenProps> = ({ onNavigate }) => {
  return (
    <main className="min-h-screen pb-28 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => onNavigate('BACK')}
          className="w-9 h-9 rounded-full bg-surface-container dark:bg-zinc-800 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="font-heading text-2xl font-bold text-on-surface dark:text-zinc-100">
            Return, Refund & Cancellation
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">Last updated · July 2026</p>
        </div>
      </div>

      {/* Policy Highlight Banner */}
      <div className="bg-tertiary-container/10 dark:bg-tertiary-container/5 border border-tertiary/15 rounded-brand p-4 mb-6 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5 text-tertiary" />
        </div>
        <div>
          <p className="text-xs font-semibold text-on-surface dark:text-zinc-100">
            No Returns · No Refunds · Replacements Only
          </p>
          <p className="text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">
            Due to pharmaceutical safety regulations, we do not accept returns or process refunds. Free replacements are available under specific conditions.
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">

        {/* Section 1: Order Cancellation */}
        <section className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <XCircle className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[10px] font-bold text-primary bg-primary/8 px-1.5 py-0.5 rounded">
                §1
              </span>
              <h2 className="text-sm font-bold text-on-surface dark:text-zinc-100">
                Order Cancellation
              </h2>
            </div>
          </div>

          <div className="space-y-3 pl-11">
            <div>
              <h3 className="text-xs font-bold text-on-surface dark:text-zinc-200 mb-0.5">
                Cancellation Window
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                You may cancel your order via the MedField platform only before the order status updates to "Processing" (i.e., before the order is assigned to a local delivery partner).
              </p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-on-surface dark:text-zinc-200 mb-0.5">
                Post-Assignment
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Once an order has been assigned to a delivery partner, the order is considered confirmed by the Vendor and can no longer be canceled.
              </p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-on-surface dark:text-zinc-200 mb-0.5">
                Doorstep Refusals
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Because orders cannot be canceled post-assignment, refusing to accept and pay for a confirmed Cash on Delivery (COD) order at your doorstep causes financial loss to our Vendors. Repeated doorstep refusals will result in the permanent suspension of your MedField account.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: No Return and No Refund */}
        <section className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Ban className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[10px] font-bold text-primary bg-primary/8 px-1.5 py-0.5 rounded">
                §2
              </span>
              <h2 className="text-sm font-bold text-on-surface dark:text-zinc-100">
                No Return and No Refund Policy
              </h2>
            </div>
          </div>

          <div className="space-y-2.5 pl-11">
            <p className="text-xs text-on-surface-variant leading-relaxed">
              MedField operates on a strictly Cash on Delivery (COD) and direct UPI/QR payment model, where payments are made directly to the Vendor's delivery personnel.
            </p>
            <div className="bg-error-container/10 dark:bg-error-container/5 border border-error/15 rounded-lg p-3.5">
              <p className="text-[10px] font-bold text-error uppercase tracking-wider mb-1">
                ⚠ Important
              </p>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Due to the sensitive nature of pharmaceutical products and regulatory safety standards, we strictly do not accept returns and do not process refunds under any circumstances once an order has been accepted and paid for at the time of delivery.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Replacement Policy */}
        <section className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[10px] font-bold text-primary bg-primary/8 px-1.5 py-0.5 rounded">
                §3
              </span>
              <h2 className="text-sm font-bold text-on-surface dark:text-zinc-100">
                Replacement Policy
              </h2>
            </div>
          </div>

          <div className="pl-11 space-y-3">
            <p className="text-xs text-on-surface-variant leading-relaxed">
              While returns and refunds are not permitted, the dispensing Vendor will provide a <span className="font-semibold text-on-surface dark:text-zinc-200">free replacement</span> of the medication only under the following specific conditions:
            </p>

            {/* Eligible Conditions */}
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <span className="text-xs text-on-surface-variant leading-relaxed">
                  <span className="font-bold text-on-surface dark:text-zinc-200">Incorrect Medication:</span> The medicine delivered to you is different from what was confirmed in your order or does not match your uploaded prescription.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <span className="text-xs text-on-surface-variant leading-relaxed">
                  <span className="font-bold text-on-surface dark:text-zinc-200">Near Expiry / Expired:</span> The medicine delivered is expired or is unusually close to its expiration date.
                </span>
              </div>
            </div>

            {/* Rejection Conditions */}
            <div className="bg-surface-container dark:bg-zinc-800 border border-outline-variant/30 rounded-lg p-3.5">
              <p className="text-[10px] font-bold text-on-surface dark:text-zinc-200 uppercase tracking-wider mb-2">
                <Package className="w-3 h-3 inline-block mr-1 -mt-0.5" />
                Strict Condition for Replacement Eligibility
              </p>
              <p className="text-[11px] text-on-surface-variant leading-relaxed mb-2">
                To qualify for a replacement, the delivered item must remain entirely intact and in its original condition. The Vendor will reject the replacement if:
              </p>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-error text-xs mt-0.5">✕</span>
                  <span className="text-[11px] text-on-surface-variant leading-relaxed">
                    Any medication or pills have been removed from their packaging.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error text-xs mt-0.5">✕</span>
                  <span className="text-[11px] text-on-surface-variant leading-relaxed">
                    The tablet strips have been cut, torn, or divided.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error text-xs mt-0.5">✕</span>
                  <span className="text-[11px] text-on-surface-variant leading-relaxed">
                    The original manufacturer's seal on bottles or packaging is broken or tampered with.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4: Requesting a Replacement */}
        <section className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[10px] font-bold text-primary bg-primary/8 px-1.5 py-0.5 rounded">
                §4
              </span>
              <h2 className="text-sm font-bold text-on-surface dark:text-zinc-100">
                Process for Requesting a Replacement
              </h2>
            </div>
          </div>

          <div className="pl-11 space-y-3">
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="text-xs font-bold text-primary bg-primary/8 px-1.5 py-0.5 rounded mt-0.5 flex-shrink-0">1</span>
                <span className="text-xs text-on-surface-variant leading-relaxed">
                  If your order meets the replacement criteria, you must report the issue, along with clear photos of the delivered items, to MedField support within 24 hours of delivery.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-xs font-bold text-primary bg-primary/8 px-1.5 py-0.5 rounded mt-0.5 flex-shrink-0">2</span>
                <span className="text-xs text-on-surface-variant leading-relaxed">
                  Upon verification, the original dispensing Vendor will arrange to collect the incorrect/near-expiry item and deliver the correct replacement to your address.
                </span>
              </li>
            </ul>

            {/* Contact Box */}
            <div className="bg-secondary-container/20 dark:bg-secondary-container/10 border border-secondary/15 rounded-lg p-3.5">
              <p className="text-xs font-semibold text-on-surface dark:text-zinc-200 mb-2">
                Contact MedField Support
              </p>
              <a
                href="mailto:buildingitlive@gmail.com"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              >
                <Mail className="w-3.5 h-3.5" />
                buildingitlive@gmail.com
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-[11px] text-on-surface-variant">
          This policy is part of MedField's Terms of Service.
        </p>
        <div className="flex items-center justify-center gap-3 mt-1">
          <button
            onClick={() => onNavigate('/terms-of-service')}
            className="text-[11px] font-semibold text-primary hover:underline"
          >
            Terms of Service
          </button>
          <span className="text-[11px] text-outline-variant">·</span>
          <button
            onClick={() => onNavigate('/privacy-policy')}
            className="text-[11px] font-semibold text-primary hover:underline"
          >
            Privacy Policy
          </button>
        </div>
      </div>
    </main>
  );
};
