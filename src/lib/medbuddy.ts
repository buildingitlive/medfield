export interface MedBuddyInfo {
  salt: string;
  other_companies: string[];
  usage: string;
  dosage: string;
  side_effects: string;
  alternatives: string[];
}

const GEMINI_PROMPT = (medicineName: string) => `You are a licensed pharmacist AI assistant. For the medicine "${medicineName}", provide accurate pharmaceutical information in the following JSON format only. Do not include any text outside the JSON.

{
  "salt": "The active salt/composition of this medicine",
  "other_companies": ["List of other pharmaceutical companies that manufacture medicines with the same salt composition"],
  "usage": "What this medicine is primarily used for, the medical conditions it treats",
  "dosage": "Typical adult dosage information and administration guidelines",
  "side_effects": "Common side effects associated with this medicine",
  "alternatives": ["List of alternative medicine names (different salts) that can be used for similar conditions"]
}

Important: Only return valid JSON. No markdown, no code fences, no extra text.`;

export async function fetchMedBuddyInfo(medicineName: string): Promise<MedBuddyInfo> {
  // In production (Vercel), use the serverless function (API key stays server-side)
  const isDev = import.meta.env.DEV;

  // In dev, go straight to direct Gemini call (no serverless function available)
  if (isDev) {
    return fetchDirectFromGemini(medicineName);
  }

  // In production (Vercel), use the serverless function (key stays server-side)
  const response = await fetch('/api/medbuddy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ medicineName }),
  });

  if (response.ok) {
    return response.json();
  }

  const err = await response.json().catch(() => ({}));
  throw new Error(err.error || `API error: ${response.status}`);
}

async function fetchDirectFromGemini(medicineName: string): Promise<MedBuddyInfo> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API not available');
  }

  const MODEL = 'gemini-3.5-flash-lite';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: GEMINI_PROMPT(medicineName) }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
    }),
  });

  if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No response from Gemini');

  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}
