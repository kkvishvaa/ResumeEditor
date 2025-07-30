import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY: string = import.meta.env.VITE_GEMINI_API_KEY || "";

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

export async function extractKeywords(jobDescription: string): Promise<string[]> {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = `Extract 10-15 most important technical and professional keywords from this job description. Return ONLY a comma-separated list without numbering or explanations:\n\n${jobDescription}`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text().trim();
  return text.split(',').map(kw => kw.trim()).filter(Boolean);
}

export async function generateBulletPoint(keywords: string[], existingBullet: string): Promise<string> {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = `Improve this resume bullet point: "${existingBullet}" by incorporating these keywords: ${keywords.join(', ')}. 
  Keep it professional, concise, and impactful. Return ONLY the improved bullet point without explanations.`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}

export async function generateNewBulletPoint(keyword: string, lines: number, withHeader: boolean): Promise<string> {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const wordTarget = lines === 1 ? 18 : 32;
  let prompt = `Create a professional resume bullet point about ${keyword}. Make it ${lines}-line length (approximately ${wordTarget} words). `;
  if (withHeader) {
    prompt += `Start with a header in the format: "${keyword}: " followed by the content.`;
  }
  prompt += " Return ONLY the bullet point text without any additional text or formatting symbols.";
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}

export async function checkATSScore(resume: string, jobDescription: string): Promise<{ score: number; feedback: string } | null> {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = `Rate this resume against the job description on a scale of 0-100% and provide 3 concise improvement suggestions. Use this format exactly:
  Score: XX%
  Feedback:
  1. [suggestion]
  2. [suggestion]
  3. [suggestion]

  Resume:
  ${resume.substring(0, 3000)}

  Job Description:
  ${jobDescription.substring(0, 3000)}`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text().trim();
  const scoreMatch = text.match(/Score:\s*(\d+)%/);
  const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
  return {
    score,
    feedback: text.replace(/Score:\s*\d+%/, '').trim()
  };
}
