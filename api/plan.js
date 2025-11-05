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

 const prompt = `You are Goal-Forge AI — a master planner. You MUST follow ALL rules.

User input:
${input}

MANDATORY RULES:
1. Generate a FULL 7-day plan: Monday through Sunday
2. Work: 09:00–17:00 on Monday, Tuesday, Wednesday, Thursday, Friday
3. Gym: 18:00–19:00 on Monday, Wednesday, Friday (3x/week)
4. Sleep: 22:00–06:00 EVERY DAY (Mon–Sun)
5. Never skip any day or event
6. Use exact colors: gray=work, blue=gym, teal=sleep
7. Output EVERY event — no summaries, no omissions

Return ONLY valid JSON. No text. No markdown. No extra fields.

{
  "week": "June 3–9",
  "events": [
    {"day": "Monday", "start": "09:00", "end": "17:00", "title": "Work", "color": "gray"},
    {"day": "Monday", "start": "18:00", "end": "19:00", "title": "Gym (Goal: 5K Training)", "color": "blue"},
    {"day": "Monday", "start": "22:00", "end": "06:00", "title": "Sleep", "color": "teal"},
    {"day": "Tuesday", "start": "09:00", "end": "17:00", "title": "Work", "color": "gray"},
    {"day": "Tuesday", "start": "22:00", "end": "06:00", "title": "Sleep", "color": "teal"},
    {"day": "Wednesday", "start": "09:00", "end": "17:00", "title": "Work", "color": "gray"},
    {"day": "Wednesday", "start": "18:00", "end": "19:00", "title": "Gym (Goal: 5K Training)", "color": "blue"},
    {"day": "Wednesday", "start": "22:00", "end": "06:00", "title": "Sleep", "color": "teal"},
    {"day": "Thursday", "start": "09:00", "end": "17:00", "title": "Work", "color": "gray"},
    {"day": "Thursday", "start": "22:00", "end": "06:00", "title": "Sleep", "color": "teal"},
    {"day": "Friday", "start": "09:00", "end": "17:00", "title": "Work", "color": "gray"},
    {"day": "Friday", "start": "18:00", "end": "19:00", "title": "Gym (Goal: 5K Training)", "color": "blue"},
    {"day": "Friday", "start": "22:00", "end": "06:00", "title": "Sleep", "color": "teal"},
    {"day": "Saturday", "start": "22:00", "end": "06:00", "title": "Sleep", "color": "teal"},
    {"day": "Sunday", "start": "22:00", "end": "06:00", "title": "Sleep", "color": "teal"}
  ]
}`;

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
