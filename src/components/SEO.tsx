import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords,
  url 
}) => {
  const siteName = 'MedField';
  const defaultTitle = `${siteName} — Online Pharmacy & Medicine Delivery`;
  const defaultDescription = 'Order medicines online with fast delivery. MedField provides genuine medicines, prescriptions, and healthcare products straight to your door.';
  const defaultKeywords = 'pharmacy, buy medicine online, prescriptions, MedField, pharmacy delivery, healthcare, drugs';

  const seo = {
    title: title ? `${title} | ${siteName}` : defaultTitle,
    description: description || defaultDescription,
    keywords: keywords || defaultKeywords,
    url: url || window.location.href,
  };

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={seo.url} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seo.url} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
    </Helmet>
  );
};
