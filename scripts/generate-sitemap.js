import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load env variables
dotenv.config({ path: '.env.local' });
if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
    dotenv.config({ path: '.env' });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Key not found in environment variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSitemap() {
    console.log('Fetching products from Supabase for sitemap...');
    const { data: products, error } = await supabase
        .from('products')
        .select('id, created_at');

    if (error) {
        console.error('Error fetching products:', error);
        process.exit(1);
    }

    console.log(`Found ${products?.length || 0} products.`);

    const today = new Date().toISOString().split('T')[0];

    const staticRoutes = [
        { url: '/', changefreq: 'daily', priority: '1.0' },
        { url: '/about', changefreq: 'monthly', priority: '0.9' },
        { url: '/search', changefreq: 'weekly', priority: '0.8' },
        { url: '/login', changefreq: 'monthly', priority: '0.5' },
        { url: '/place-order', changefreq: 'monthly', priority: '0.7' },
        { url: '/terms-of-service', changefreq: 'yearly', priority: '0.3' },
        { url: '/privacy-policy', changefreq: 'yearly', priority: '0.3' },
        { url: '/refund-policy', changefreq: 'yearly', priority: '0.3' },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Add static routes
    for (const route of staticRoutes) {
        xml += `  <url>\n`;
        xml += `    <loc>https://medfield.in${route.url}</loc>\n`;
        xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
        xml += `    <priority>${route.priority}</priority>\n`;
        xml += `  </url>\n`;
    }

    // Add product routes
    if (products) {
        for (const product of products) {
            const lastMod = product.created_at ? new Date(product.created_at).toISOString().split('T')[0] : today;
            xml += `  <url>\n`;
            xml += `    <loc>https://medfield.in/medicine/${product.id}</loc>\n`;
            xml += `    <lastmod>${lastMod}</lastmod>\n`;
            xml += `    <changefreq>weekly</changefreq>\n`;
            xml += `    <priority>0.6</priority>\n`;
            xml += `  </url>\n`;
        }
    }

    xml += `</urlset>`;

    const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    fs.writeFileSync(outputPath, xml);
    console.log(`Sitemap successfully generated at ${outputPath}`);
}

generateSitemap();
