import type { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'gemini-3.5-flash-lite';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { medicineName } = req.body;

  if (!medicineName || typeof medicineName !== 'string') {
    return res.status(400).json({ error: 'medicineName is required' });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Gemini API key not configured' });
  }

  const prompt = `You are a licensed pharmacist AI assistant. For the medicine "${medicineName}", provide accurate pharmaceutical information in the following JSON format only. Do not include any text outside the JSON.

{
  "salt": "The active salt/composition of this medicine",
  "other_companies": ["List of other pharmaceutical companies that manufacture medicines with the same salt composition"],
  "usage": "What this medicine is primarily used for, the medical conditions it treats",
  "dosage": "Typical adult dosage information and administration guidelines",
  "side_effects": "Common side effects associated with this medicine",
  "alternatives": ["List of alternative medicine names (different salts) that can be used for similar conditions"]
}

Important: Only return valid JSON. No markdown, no code fences, no extra text.`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Gemini API error: ${response.status}` });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({ error: 'No response from Gemini' });
    }

    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return res.status(200).json(parsed);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
