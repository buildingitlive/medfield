import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  schema?: Record<string, unknown>;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords,
  url,
  schema
}) => {
  const siteName = 'MedField';
  const defaultTitle = `${siteName} | Genuine Medicine Delivery`;
  const defaultDescription = 'MedField delivers genuine medicines to your door. Get up to 15% discount, same-day delivery, and no delivery charges on every order.';
  const defaultKeywords = 'pharmacy, buy medicine online, MedField, pharmacy delivery, healthcare, fast medicine delivery, genuine medicines';

  const seo = {
    title: title ? `${siteName} | ${title}` : defaultTitle,
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

      {/* JSON-LD Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};
