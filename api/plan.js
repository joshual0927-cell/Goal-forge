import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input } = req.body;
  if (!input) {
    return res.status(400).json({ error: 'No input' });
  }

  const prompt = `You are Goal-Forge AI — a master planner. 

User input:
${input}

Return ONLY valid JSON:
{
  "week": "June 3–9",
  "events": [
    {
      "day": "Monday",
      "start": "18:00",
      "end": "19:00",
      "title": "Gym (Goal: 5K Training)",
      "color": "blue"
    }
  ]
}
No explanations. No markdown.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const jsonString = completion.choices[0].message.content.trim();
    const plan = JSON.parse(jsonString);
    res.status(200).json(plan);
  } catch (error) {
    console.error('AI Error:', error.message);
    res.status(500).json({ error: 'AI failed: ' + error.message });
  }
}
