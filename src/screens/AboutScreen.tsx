import React from 'react';
import {
  ArrowLeft,
  MapPin,
  Pill,
  Truck,
  Shield,
  Clock,
  Phone,
  Heart,
  BadgeCheck,
  Users,
} from 'lucide-react';
import { SEO } from '../components/SEO';

interface AboutScreenProps {
  onNavigate: (route: string) => void;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ onNavigate }) => {
  return (
    <>
      <SEO
        title="About MedField — Online Medicine Delivery in Gorakhpur"
        description="MedField is Gorakhpur's trusted online pharmacy delivering genuine medicines to your doorstep. Same-day delivery, verified pharmacists, and up to 15% off on all medicines in Gorakhpur, Uttar Pradesh."
        keywords="online pharmacy Gorakhpur, medicine delivery Gorakhpur, buy medicine online Gorakhpur, pharmacy near me Gorakhpur, MedField pharmacy, medicine home delivery Gorakhpur UP, online medical store Gorakhpur, dawai delivery Gorakhpur, pharmacy delivery Rustampur, medicine order Gorakhpur, affordable medicine Gorakhpur, same day medicine delivery"
        schema={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": "https://medfield.in/#organization",
          "name": "MedField",
          "alternateName": "MedField Pharmacy Gorakhpur",
          "image": "https://medfield.in/logo.png",
          "logo": "https://medfield.in/logo.png",
          "description": "MedField is Gorakhpur's trusted online pharmacy platform. We deliver genuine, verified medicines directly to your doorstep with same-day delivery, verified pharmacists, and discounts of up to 15%.",
          "url": "https://medfield.in",
          "telephone": "+91 9389407550",
          "email": "support@medfield.in",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "P86, Shakti Nagar Colony, Bagha Baba Road, Rustampur (south)",
            "addressLocality": "Gorakhpur",
            "addressRegion": "Uttar Pradesh",
            "postalCode": "273016",
            "addressCountry": "IN"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "26.7606",
            "longitude": "83.3732"
          },
          "areaServed": [
            {
              "@type": "City",
              "name": "Gorakhpur",
              "containedInPlace": {
                "@type": "State",
                "name": "Uttar Pradesh"
              }
            }
          ],
          "priceRange": "₹10 - ₹2000",
          "openingHours": "Mo-Su 00:00-23:59",
          "sameAs": [],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Medicine Catalog",
            "itemListElement": [
              {
                "@type": "OfferCatalog",
                "name": "Prescription Medicines"
              },
              {
                "@type": "OfferCatalog",
                "name": "Over-the-Counter Medicines"
              },
              {
                "@type": "OfferCatalog",
                "name": "Healthcare Products"
              }
            ]
          }
        }}
      />

      <main className="min-h-screen pb-28 max-w-3xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-surface/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-surface-variant dark:border-zinc-800 px-4 sm:px-6 py-3.5 flex items-center gap-3">
          <button
            onClick={() => onNavigate('BACK')}
            className="w-9 h-9 rounded-full bg-surface-container dark:bg-zinc-800 flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-bold text-on-surface dark:text-zinc-100">
            About MedField
          </h1>
        </div>

        <div className="px-4 sm:px-6 py-6 space-y-8">
          {/* Hero Section */}
          <section className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
              <img src="/logo.png" alt="MedField Logo" className="w-10 h-10 object-contain" />
            </div>
            <h2 className="font-heading text-xl font-bold text-on-surface dark:text-zinc-100">
              Gorakhpur's Trusted Online Pharmacy
            </h2>
            <p className="text-sm text-on-surface-variant leading-relaxed max-w-md mx-auto">
              MedField delivers genuine, verified medicines right to your doorstep in Gorakhpur. 
              Same-day delivery. No delivery charges. Up to 15% off on every order.
            </p>
          </section>

          {/* What We Do */}
          <section className="space-y-4">
            <h2 className="font-heading text-base font-bold text-on-surface dark:text-zinc-100 flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              What We Do
            </h2>
            <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-5 space-y-3">
              <p className="text-sm text-on-surface-variant leading-relaxed">
                MedField is an <strong className="text-on-surface dark:text-zinc-200">online medicine delivery platform</strong> built 
                for the people of <strong className="text-on-surface dark:text-zinc-200">Gorakhpur, Uttar Pradesh</strong>. We connect you 
                with licensed, local pharmacies so you can order your medicines from the comfort of your home — 
                no more waiting in long queues at medical stores.
              </p>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Whether you need <strong className="text-on-surface dark:text-zinc-200">prescription medicines</strong>, 
                <strong className="text-on-surface dark:text-zinc-200"> over-the-counter drugs</strong>, vitamins, first aid supplies, 
                or chronic disease medication for <strong className="text-on-surface dark:text-zinc-200">diabetes</strong>, 
                <strong className="text-on-surface dark:text-zinc-200"> heart health</strong>, or 
                <strong className="text-on-surface dark:text-zinc-200"> allergies</strong> — MedField has you covered with 
                fast, reliable delivery across Gorakhpur city.
              </p>
            </div>
          </section>

          {/* Why Choose MedField */}
          <section className="space-y-4">
            <h2 className="font-heading text-base font-bold text-on-surface dark:text-zinc-100 flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-primary" />
              Why Gorakhpur Trusts MedField
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  icon: BadgeCheck,
                  title: '100% Genuine Medicines',
                  desc: 'Every medicine is sourced from licensed pharmacies and verified by registered pharmacists before dispatch.',
                },
                {
                  icon: Truck,
                  title: 'Same-Day Delivery',
                  desc: 'Order your medicines and get them delivered to your door on the same day — across all areas of Gorakhpur.',
                },
                {
                  icon: Shield,
                  title: 'Free Delivery, Always',
                  desc: 'No hidden delivery charges. No minimum order value. Just genuine medicines at the best prices.',
                },
                {
                  icon: Clock,
                  title: 'Open 24/7 Online',
                  desc: 'Place your order anytime — day or night. Our pharmacist will confirm and dispatch your order during business hours.',
                },
                {
                  icon: Users,
                  title: 'Pharmacist Verification',
                  desc: 'A real pharmacist reviews every prescription and calls you to confirm your order before dispatch.',
                },
                {
                  icon: Pill,
                  title: 'Up to 15% Discount',
                  desc: 'Get attractive discounts on your medicines, saving you more on every refill and routine order.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-4 flex gap-3"
                >
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-on-surface dark:text-zinc-100">
                      {item.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Areas We Serve */}
          <section className="space-y-4">
            <h2 className="font-heading text-base font-bold text-on-surface dark:text-zinc-100 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Areas We Deliver In Gorakhpur
            </h2>
            <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-5 space-y-3">
              <p className="text-sm text-on-surface-variant leading-relaxed">
                MedField currently delivers medicines across <strong className="text-on-surface dark:text-zinc-200">Gorakhpur city</strong> and 
                surrounding areas. Whether you live in <strong className="text-on-surface dark:text-zinc-200">Rustampur</strong>, 
                <strong className="text-on-surface dark:text-zinc-200"> Shahpur</strong>, 
                <strong className="text-on-surface dark:text-zinc-200"> Mohaddipur</strong>, 
                <strong className="text-on-surface dark:text-zinc-200"> Golghar</strong>, 
                <strong className="text-on-surface dark:text-zinc-200"> Civil Lines</strong>, 
                <strong className="text-on-surface dark:text-zinc-200"> Medical College Road</strong>, 
                <strong className="text-on-surface dark:text-zinc-200"> Basharatpur</strong>, 
                <strong className="text-on-surface dark:text-zinc-200"> Shakti Nagar</strong>, 
                <strong className="text-on-surface dark:text-zinc-200"> Taramandal</strong>, 
                <strong className="text-on-surface dark:text-zinc-200"> Purdilpur</strong>, or any locality within the city 
                — we'll deliver your medicines right to your door.
              </p>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                We are expanding rapidly and plan to serve more cities in <strong className="text-on-surface dark:text-zinc-200">Uttar Pradesh</strong> soon. 
                Stay tuned!
              </p>
            </div>
          </section>

          {/* How to Order */}
          <section className="space-y-4">
            <h2 className="font-heading text-base font-bold text-on-surface dark:text-zinc-100 flex items-center gap-2">
              <Pill className="w-5 h-5 text-primary" />
              How to Order Medicines on MedField
            </h2>
            <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-5">
              <ol className="space-y-3 text-sm text-on-surface-variant leading-relaxed list-decimal list-inside">
                <li>
                  <strong className="text-on-surface dark:text-zinc-200">Upload your prescription</strong> or type out the list of medicines you need with quantity.
                </li>
                <li>
                  <strong className="text-on-surface dark:text-zinc-200">Our pharmacist calls you</strong> to verify and confirm your order details.
                </li>
                <li>
                  <strong className="text-on-surface dark:text-zinc-200">Your discount and final total</strong> are confirmed before dispatch.
                </li>
                <li>
                  <strong className="text-on-surface dark:text-zinc-200">Order is dispatched</strong> from the nearest licensed pharmacy.
                </li>
                <li>
                  <strong className="text-on-surface dark:text-zinc-200">Delivered to your door</strong> — same day or next day, guaranteed.
                </li>
              </ol>
            </div>
          </section>

          {/* Contact Information */}
          <section className="space-y-4">
            <h2 className="font-heading text-base font-bold text-on-surface dark:text-zinc-100 flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              Contact Us
            </h2>
            <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-5 space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-on-surface-variant">
                  P86, Shakti Nagar Colony, Bagha Baba Road, Rustampur (south), <strong className="text-on-surface dark:text-zinc-200">Gorakhpur — 273016</strong>, Uttar Pradesh, India
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <a href="tel:+919389407550" className="text-sm text-primary font-semibold hover:underline">
                  +91 93894 07550
                </a>
              </div>
            </div>
          </section>

          {/* CTA */}
          <button
            onClick={() => onNavigate('/place-order')}
            className="w-full min-h-[48px] rounded-brand bg-primary hover:bg-primary/90 text-on-primary font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <Pill className="w-5 h-5" />
            Order Your Medicines Now
          </button>
        </div>
      </main>
    </>
  );
};
