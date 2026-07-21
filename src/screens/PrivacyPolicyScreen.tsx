import React from 'react';
import { ArrowLeft, Shield, Database, Share2, Lock, UserCheck, Mail } from 'lucide-react';

interface PrivacyPolicyScreenProps {
  onNavigate: (route: string) => void;
}

export const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({ onNavigate }) => {
  const sections = [
    {
      icon: Database,
      number: '1',
      title: 'Information We Collect',
      intro: 'To facilitate your orders, MedField collects the following data:',
      subsections: [
        {
          label: 'Personal Information',
          text: 'Name, delivery address, and phone number.',
        },
        {
          label: 'Sensitive Personal Data (SPDI)',
          text: 'Images of medical prescriptions uploaded to the Platform and the list of medications requested.',
        },
      ],
    },
    {
      icon: Shield,
      number: '2',
      title: 'How We Use Your Information',
      intro: 'Your data is collected strictly for the purpose of order routing and fulfillment. We use your information to:',
      bullets: [
        'Calculate order discounts and finalize pricing.',
        'Forward your delivery address and prescription to licensed local Vendors in Gorakhpur to fulfill the order.',
        'Provide order status updates on your user dashboard.',
      ],
    },
    {
      icon: Share2,
      number: '3',
      title: 'Data Sharing and Third Parties',
      content: 'To execute our service, we must share your uploaded prescription, phone number, and delivery location with our registered Vendor pharmacies and their delivery personnel. By using MedField, you consent to this bipartite data sharing. We do not sell your personal data or prescriptions to external marketing agencies or third-party data brokers.',
    },
    {
      icon: Lock,
      number: '4',
      title: 'Data Security and Retention',
      content: 'We implement standard security protocols to protect your data. We will retain your personal data and uploaded prescriptions securely on our servers indefinitely, or until you explicitly request us to delete them.',
      alert: {
        label: 'Legal Exception',
        text: 'To comply with the Indian Drugs and Cosmetics Act and IT intermediary guidelines, certain transaction histories and prescription records must legally be retained for a period of up to 3 years. If a deletion request is made, your active account will be removed, but these specific logs will be securely archived for the mandatory period before being permanently destroyed.',
      },
    },
    {
      icon: UserCheck,
      number: '5',
      title: 'Your Rights and Contact Information',
      content: 'Under the Digital Personal Data Protection (DPDP) Act, you have the right to request access to the personal data we hold about you and request the deletion of your account and prescription history.',
      contact: {
        label: 'For Support & Data Deletion Requests',
        email: 'buildingitlive@gmail.com',
        note: 'Deletion requests are processed promptly, subject to the completion of any pending orders and the legal retention mandates outlined in Section 4.',
      },
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
            Privacy Policy
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">Last updated · July 2026</p>
        </div>
      </div>

      {/* DPDP Compliance Banner */}
      <div className="bg-primary/5 dark:bg-primary/10 border border-primary/15 rounded-brand p-4 mb-6 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xs font-semibold text-on-surface dark:text-zinc-100">
            Your Privacy Matters
          </p>
          <p className="text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">
            MedField complies with India's Digital Personal Data Protection (DPDP) Act. You have the right to access and delete your personal data at any time.
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

              {/* Intro Text */}
              {section.intro && (
                <p className="text-xs text-on-surface-variant leading-relaxed pl-11 mb-2.5">
                  {section.intro}
                </p>
              )}

              {/* Main Content */}
              {section.content && (
                <p className="text-xs text-on-surface-variant leading-relaxed pl-11">
                  {section.content}
                </p>
              )}

              {/* Bullet Points */}
              {section.bullets && (
                <ul className="space-y-2 pl-11">
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

              {/* Subsections */}
              {section.subsections && (
                <div className="space-y-2.5 pl-11">
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

              {/* Legal Alert Box */}
              {section.alert && (
                <div className="mt-3 ml-11 bg-tertiary-container/10 dark:bg-tertiary-container/5 border border-tertiary/15 rounded-lg p-3.5">
                  <p className="text-[10px] font-bold text-tertiary uppercase tracking-wider mb-1">
                    ⚠ {section.alert.label}
                  </p>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    {section.alert.text}
                  </p>
                </div>
              )}

              {/* Contact Box */}
              {section.contact && (
                <div className="mt-3 ml-11 bg-secondary-container/20 dark:bg-secondary-container/10 border border-secondary/15 rounded-lg p-3.5">
                  <p className="text-xs font-semibold text-on-surface dark:text-zinc-200 mb-2">
                    {section.contact.label}
                  </p>
                  <a
                    href={`mailto:${section.contact.email}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mb-2"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {section.contact.email}
                  </a>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    {section.contact.note}
                  </p>
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-[11px] text-on-surface-variant">
          By using MedField, you agree to our Privacy Policy.
        </p>
        <button
          onClick={() => onNavigate('/terms-of-service')}
          className="text-[11px] font-semibold text-primary hover:underline mt-1 inline-block"
        >
          Read our Terms of Service →
        </button>
      </div>
    </main>
  );
};
