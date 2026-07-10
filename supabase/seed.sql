-- ============================================================
-- MedField PWA — Seed Data (India-Centric)
-- Run AFTER schema.sql in Supabase SQL Editor
-- ============================================================

-- Clear existing products
DELETE FROM public.products;

INSERT INTO public.products (id, name, generic_name, dosage, form, price, mrp, in_stock, requires_prescription, grower_name, grower_location, grower_certification, grower_purity_score, batch_number, harvest_date, description, image_url, category)
VALUES
  (
    'a1b2c3d4-0001-4000-8000-000000000001',
    'Dolo 650',
    'Paracetamol IP 650mg',
    '650mg • As Needed',
    'Tablet',
    30.00, 35.00, true, false,
    'Micro Labs Ltd', 'Bengaluru, Karnataka', 'GMP-IN-2026-4421', 99.8,
    'BATCH-ML-66201', '2026-06-10',
    'India''s most trusted fever and pain reliever. Each tablet contains 650mg Paracetamol IP for effective relief from headache, toothache, body pain and fever.',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    'Analgesic'
  ),
  (
    'a1b2c3d4-0002-4000-8000-000000000002',
    'Azithral 500',
    'Azithromycin IP 500mg',
    '500mg • Once Daily',
    'Tablet',
    105.00, 135.00, true, true,
    'Alembic Pharmaceuticals', 'Vadodara, Gujarat', 'WHO-GMP-IN-2026', 99.6,
    'BATCH-AP-33021', '2026-05-28',
    'Broad-spectrum macrolide antibiotic for respiratory tract infections, ENT infections, and skin infections. Prescribed for 3-5 day courses.',
    'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=600&q=80',
    'Immunology'
  ),
  (
    'a1b2c3d4-0003-4000-8000-000000000003',
    'Pan-D',
    'Pantoprazole 40mg + Domperidone 30mg',
    '40mg+30mg • Before Breakfast',
    'Capsule',
    145.00, 180.00, true, true,
    'Alkem Laboratories', 'Taloja, Maharashtra', 'ISO-9001-PHARMA', 99.5,
    'BATCH-AK-87410', '2026-06-15',
    'Combination gastro-protective capsule for acidity, GERD and bloating. Pantoprazole reduces stomach acid while Domperidone improves gut motility.',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80',
    'Wellness'
  ),
  (
    'a1b2c3d4-0004-4000-8000-000000000004',
    'Shelcal 500',
    'Calcium Carbonate 500mg + Vitamin D3 250IU',
    '500mg+250IU • Twice Daily',
    'Tablet',
    168.00, 210.00, true, false,
    'Torrent Pharmaceuticals', 'Ahmedabad, Gujarat', 'GMP-IN-2026-7801', 99.7,
    'BATCH-TP-44019', '2026-06-08',
    'Essential calcium and vitamin D3 supplement for strong bones and teeth. Recommended for women, elderly, and those with calcium deficiency.',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    'Wellness'
  ),
  (
    'a1b2c3d4-0005-4000-8000-000000000005',
    'Augmentin 625 Duo',
    'Amoxicillin 500mg + Clavulanic Acid 125mg',
    '625mg • Twice Daily',
    'Tablet',
    215.00, 268.00, true, true,
    'GlaxoSmithKline Pharma', 'Nashik, Maharashtra', 'WHO-GMP-IN-2026', 99.9,
    'BATCH-GSK-99201', '2026-06-18',
    'Powerful broad-spectrum antibiotic combination for bacterial infections of the throat, lungs, ear, sinuses, urinary tract, and skin.',
    'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=600&q=80',
    'Immunology'
  ),
  (
    'a1b2c3d4-0006-4000-8000-000000000006',
    'Combiflam',
    'Ibuprofen 400mg + Paracetamol 325mg',
    '400mg+325mg • As Needed',
    'Tablet',
    42.00, 52.00, true, false,
    'Sanofi India Ltd', 'Ankleshwar, Gujarat', 'GMP-IN-2026-5590', 99.6,
    'BATCH-SN-12098', '2026-05-25',
    'Dual-action pain reliever combining Ibuprofen and Paracetamol for fast relief from body pain, headache, dental pain, and menstrual cramps.',
    'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80',
    'Analgesic'
  ),
  (
    'a1b2c3d4-0007-4000-8000-000000000007',
    'Crocin Advance',
    'Paracetamol IP 500mg',
    '500mg • Every 6 Hours',
    'Tablet',
    24.00, 30.00, true, false,
    'GlaxoSmithKline Pharma', 'Nashik, Maharashtra', 'WHO-GMP-IN-2026', 99.9,
    'BATCH-GSK-77604', '2026-06-22',
    'Fast-acting paracetamol tablet for quick relief from fever, headache, and mild to moderate pain. Safe for adults and children above 12 years.',
    'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=600&q=80',
    'Analgesic'
  ),
  (
    'a1b2c3d4-0008-4000-8000-000000000008',
    'Allegra 120',
    'Fexofenadine Hydrochloride 120mg',
    '120mg • Once Daily',
    'Tablet',
    175.00, 220.00, true, false,
    'Sanofi India Ltd', 'Ankleshwar, Gujarat', 'GMP-IN-2026-5590', 99.6,
    'BATCH-SN-55032', '2026-06-05',
    'Non-drowsy antihistamine for allergic rhinitis, sneezing, runny nose, itchy eyes, and chronic urticaria. Does not cause sedation.',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80',
    'Immunology'
  ),
  (
    'a1b2c3d4-0009-4000-8000-000000000009',
    'Becosules Capsules',
    'B-Complex with Vitamin C & Folic Acid',
    'Multi • Once Daily',
    'Capsule',
    32.00, 40.00, true, false,
    'Pfizer Ltd India', 'Thane, Maharashtra', 'WHO-GMP-IN-2026', 99.4,
    'BATCH-PF-88210', '2026-06-12',
    'Complete B-vitamin supplement with Vitamin C for boosting immunity, preventing mouth ulcers, improving appetite, and maintaining skin health.',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    'Wellness'
  ),
  (
    'a1b2c3d4-0010-4000-8000-000000000010',
    'Volini Spray',
    'Diclofenac Diethylamine 1.16% w/w',
    '1.16% • Topical Spray',
    'Topical',
    220.00, 275.00, true, false,
    'Sun Pharma', 'Silvassa, Dadra & Nagar Haveli', 'GMP-IN-2026-8820', 99.3,
    'BATCH-SP-44017', '2026-06-20',
    'Instant pain relief spray for back pain, neck pain, knee pain, shoulder pain, and muscle sprains. Quick absorption, no mess application.',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    'Analgesic'
  ),
  (
    'a1b2c3d4-0011-4000-8000-000000000011',
    'Metformin 500',
    'Metformin Hydrochloride IP 500mg',
    '500mg • Twice Daily with Meals',
    'Tablet',
    28.00, 35.00, true, true,
    'USV Pvt Ltd', 'Daman, Daman & Diu', 'GMP-IN-2026-3310', 99.7,
    'BATCH-USV-22019', '2026-05-30',
    'First-line oral antidiabetic medication for Type 2 Diabetes Mellitus. Improves insulin sensitivity and reduces hepatic glucose production.',
    'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80',
    'Cardiac'
  ),
  (
    'a1b2c3d4-0012-4000-8000-000000000012',
    'Ecosprin 75',
    'Aspirin (Acetylsalicylic Acid) 75mg',
    '75mg • Once Daily After Meal',
    'Tablet',
    10.00, 14.00, true, true,
    'USV Pvt Ltd', 'Daman, Daman & Diu', 'GMP-IN-2026-3310', 99.7,
    'BATCH-USV-10984', '2026-06-01',
    'Low-dose aspirin for prevention of heart attacks and strokes. Widely prescribed as blood thinner for cardiac patients.',
    'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=600&q=80',
    'Cardiac'
  ),
  (
    'a1b2c3d4-0013-4000-8000-000000000013',
    'ORS Electral Powder',
    'Oral Rehydration Salts IP',
    '21.8g Sachet • As Needed',
    'Extract',
    22.00, 28.00, true, false,
    'FDC Ltd', 'Mumbai, Maharashtra', 'GMP-IN-2026-4450', 99.5,
    'BATCH-FDC-60210', '2026-06-14',
    'WHO-formula oral rehydration salt for treatment of dehydration due to diarrhoea, vomiting, heat stroke, and excessive sweating.',
    'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=600&q=80',
    'Wellness'
  ),
  (
    'a1b2c3d4-0014-4000-8000-000000000014',
    'Montair LC',
    'Montelukast 10mg + Levocetirizine 5mg',
    '10mg+5mg • Once Daily at Night',
    'Tablet',
    155.00, 195.00, true, true,
    'Cipla Ltd', 'Kurkumbh, Maharashtra', 'WHO-GMP-IN-2026', 99.8,
    'BATCH-CIP-33098', '2026-06-17',
    'Combination anti-allergic for allergic rhinitis, asthma prevention, and chronic urticaria. Provides 24-hour allergy relief.',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    'Immunology'
  ),
  (
    'a1b2c3d4-0015-4000-8000-000000000015',
    'Zincovit Tablets',
    'Multivitamin, Multimineral & Antioxidant',
    'Multi • Once Daily After Meal',
    'Tablet',
    115.00, 145.00, true, false,
    'Apex Laboratories', 'Chennai, Tamil Nadu', 'GMP-IN-2026-6670', 99.4,
    'BATCH-AX-88104', '2026-06-09',
    'Complete daily nutritional supplement with zinc, vitamins, and grape seed extract. Boosts immunity and fills nutritional gaps in daily diet.',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    'Wellness'
  )
ON CONFLICT (id) DO NOTHING;
