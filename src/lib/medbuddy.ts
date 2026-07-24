export interface MedBuddyInfo {
  salt: string;
  other_companies: string[];
  usage: string;
  dosage: string;
  side_effects: string;
  alternatives: string[];
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = 'gemini-3.5-flash-lite';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

export async function fetchMedBuddyInfo(medicineName: string): Promise<MedBuddyInfo> {
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
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('No response from Gemini');
  }

  // Clean any markdown code fences if present
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  try {
    const parsed: MedBuddyInfo = JSON.parse(cleaned);
    return parsed;
  } catch {
    throw new Error('Failed to parse Gemini response');
  }
}
