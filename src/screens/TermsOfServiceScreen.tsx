import React from 'react';
import { ArrowLeft, Shield, Building2, Truck, CreditCard, Scale, Gavel } from 'lucide-react';

interface TermsOfServiceScreenProps {
  onNavigate: (route: string) => void;
}

export const TermsOfServiceScreen: React.FC<TermsOfServiceScreenProps> = ({ onNavigate }) => {
  const sections = [
    {
      icon: Building2,
      number: '1',
      title: 'Introduction',
      content: `Welcome to MedField. MedField is legally owned by HERBEXLIFE and developed and maintained by BuildingItLive. These Terms of Service govern your use of the MedField platform (the "Platform"). MedField functions strictly as a technology intermediary under Section 79 of the Information Technology Act, 2000. MedField is not a licensed pharmacy, does not hold medical inventory, and does not sell or dispense pharmaceutical products.`,
    },
    {
      icon: Truck,
      number: '2',
      title: 'The MedField Service',
      content: `MedField facilitates the connection between users and independent, licensed third-party pharmacies ("Vendors") operating in Gorakhpur. Our role is strictly limited to forwarding your prescription and order details to a local Vendor, who is solely responsible for fulfilling, dispensing, and delivering the order.`,
    },
    {
      icon: Shield,
      number: '3',
      title: 'Eligibility and Prescriptions',
      bullets: [
        'You must be at least 18 years old to use this Platform.',
        'Orders for prescription medications (Schedule H, H1, etc.) require the upload of a valid, legible prescription from a registered medical practitioner.',
        "The Vendor's registered pharmacist retains the right to verify, accept, or reject the prescription. MedField does not verify the medical accuracy of prescriptions.",
      ],
    },
    {
      icon: CreditCard,
      number: '4',
      title: 'Orders, Pricing, and Delivery',
      subsections: [
        {
          label: 'Minimum Order',
          text: 'All orders must meet a minimum cart value of ₹499.',
        },
        {
          label: 'Article Ordering',
          text: 'Complete strip/bottle/vial/container/box will only be delivered. No article will be delivered in parts.',
        },
        {
          label: 'Pricing',
          text: 'MedField guarantees a minimum 15% discount on the Maximum Retail Price (MRP). The final price is calculated and displayed on your user dashboard before fulfillment.',
        },
        {
          label: 'Delivery',
          text: "Deliveries are executed directly by the Vendor's personnel. Orders placed and confirmed before 6:00 PM IST will be processed for same-day delivery. Orders placed after 6:00 PM will be processed the following business day.",
        },
      ],
    },
    {
      icon: CreditCard,
      number: '5',
      title: 'Payments and Billing',
      bullets: [
        'MedField does not collect payments for medical products on the platform.',
        "All payments are strictly Cash on Delivery (COD) or direct UPI/QR payment to the Vendor's delivery personnel at the time of delivery.",
        'The official retail invoice for the medicines is generated and provided exclusively by the dispensing Vendor. MedField does not issue medical invoices.',
      ],
    },
    {
      icon: Scale,
      number: '6',
      title: 'Limitation of Liability and Disclaimers',
      bullets: [
        'MedField provides no medical advice, diagnoses, or endorsements of any medications.',
        'Because the contract of sale is strictly between you and the Vendor, MedField assumes no liability for the quality, authenticity, or expiration of the medicines provided.',
        'MedField is not liable for delivery delays, dispensing errors by the Vendor, or adverse drug reactions.',
      ],
    },
    {
      icon: Gavel,
      number: '7',
      title: 'Governing Law',
      content: 'These terms are governed by the laws of India. Any disputes arising from the use of the platform shall be subject to the exclusive jurisdiction of the courts in Gorakhpur, Uttar Pradesh.',
    },
  ];

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
            Terms of Service
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">Last updated · July 2026</p>
        </div>
      </div>

      {/* Legal Entity Banner */}
      <div className="bg-primary/5 dark:bg-primary/10 border border-primary/15 rounded-brand p-4 mb-6 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xs font-semibold text-on-surface dark:text-zinc-100">
            MedField — Owned by HERBEXLIFE
          </p>
          <p className="text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">
            Developed & maintained by BuildingItLive. Operating as a technology intermediary under IT Act §79.
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <section
              key={section.number}
              className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-5 shadow-sm"
            >
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] font-bold text-primary bg-primary/8 px-1.5 py-0.5 rounded">
                    §{section.number}
                  </span>
                  <h2 className="text-sm font-bold text-on-surface dark:text-zinc-100">
                    {section.title}
                  </h2>
                </div>
              </div>

              {/* Content */}
              {section.content && (
                <p className="text-xs text-on-surface-variant leading-relaxed pl-11">
                  {section.content}
                </p>
              )}

              {/* Bullet Points */}
              {section.bullets && (
                <ul className="space-y-2.5 pl-11">
                  {section.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span className="text-xs text-on-surface-variant leading-relaxed">
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Subsections (e.g., Orders section) */}
              {section.subsections && (
                <div className="space-y-3 pl-11">
                  {section.subsections.map((sub, idx) => (
                    <div key={idx}>
                      <h3 className="text-xs font-bold text-on-surface dark:text-zinc-200 mb-0.5">
                        {sub.label}
                      </h3>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        {sub.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-[11px] text-on-surface-variant">
          By using MedField, you agree to these Terms of Service.
        </p>
        <button
          onClick={() => onNavigate('/privacy-policy')}
          className="text-[11px] font-semibold text-primary hover:underline mt-1 inline-block"
        >
          Read our Privacy Policy →
        </button>
      </div>
    </main>
  );
};
