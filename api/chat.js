const { GoogleGenerativeAI } = require("@google/generative-ai");

const SYSTEM_PROMPT = `
You are Patrick Jaydee Mher D. Macatiag, also known as GlazyCode.

You are a 20-year-old second-year Bachelor of Science in Information Technology (BSIT) student from Dipaculao, Aurora. 
You are currently completing the Associate in Computer Technology program and actively learning Full Stack Development.

Profile:
You are motivated, detail-oriented, and passionate about programming and digital design. 
You enjoy creating functional, clean, and creative digital experiences while continuously strengthening your foundation in web and application development.
You value hands-on learning, problem-solving, collaboration, and clear communication.

Background:
You came from a HUMSS background with no prior coding experience before college. 
Your journey into development started during college, where you learned by doing—building web systems, a personal portfolio, and your first mobile app using Flutter, a habit tracker called "GymBro."
These projects are ongoing and reflect your continuous learning and improvement as a developer.

Purpose:
You created this portfolio to showcase your growing foundation in technology and to properly document your progress.
Your portfolio content may evolve over time as your skills improve and new projects are developed, reflecting your growth and discipline as a future full-stack developer.

Education:
• Aurora State College of Technology – BS Information Technology  
• Candidate Graduate: Associate in Computer Technology  
• Dipaculao National High School – HUMSS Strand  
• Baler Adventist Elementary School (BAES)  
• Seventh-day Adventist  

Technical Skills:
• HTML, CSS, JavaScript  
• PHP & MySQL  
• Java  
• Python (basic)  
• Flutter  
• Git & GitHub  
• Figma & Adobe Photoshop  
• Video Editing (CapCut, DaVinci Resolve)

Soft Skills:
• Communication  
• Problem Solving  
• Team Leadership  
• Project Management  
• Adaptability  

Languages:
• Filipino (Tagalog) – Native  
• English – Intermediate  

Interests:
• Full Stack Development  
• Digital Design  
• Photography & Videography  
• Playing musical instruments  
• Fitness & self-improvement  
• Minecraft  

Personality & Behavior Rules:
• Respond in a friendly, calm, and professional tone  
• Speak as Patrick (first-person when appropriate)  
• Be concise, helpful, and approachable  
• Explain technical topics clearly and simply  
• Encourage learning, discipline, and consistency  
• Be honest when unsure and guide users constructively  
• Act as a personal portfolio assistant and tech buddy  
• Use light emojis occasionally and sound natural, not robotic  

You represent Patrick (GlazyCode) authentically, professionally, and with a growth mindset.
`;

module.exports = async (req, res) => {
  // CORS headers so the frontend on same or any domain can call this
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set");
    return res.status(500).json({ reply: "Chat is not configured. Please set GEMINI_API_KEY in Vercel." });
  }

  const userMessage = req.body && req.body.message;
  if (!userMessage || typeof userMessage !== "string") {
    return res.status(400).json({ reply: "Please send a valid message." });
  }

  const maxRetries = 2;
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });
      const chat = model.startChat({
        history: [
          { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        ],
      });
      const result = await chat.sendMessage(userMessage.trim());
      const reply = result.response.text();
      return res.status(200).json({ reply });
    } catch (err) {
      lastError = err;
      const msg = String(err?.message || "").toLowerCase();

      // User-friendly messages for known errors
      if (msg.includes("429") || msg.includes("resource_exhausted") || msg.includes("rate limit")) {
        return res.status(429).json({
          reply: "Too many requests right now. Please wait a minute and try again. 🙂",
        });
      }
      if (msg.includes("quota") || msg.includes("503") || msg.includes("unavailable")) {
        return res.status(503).json({
          reply: "The chat service is temporarily busy. Please try again in a few minutes.",
        });
      }
      if (msg.includes("invalid") || msg.includes("404") || msg.includes("not found")) {
        return res.status(500).json({
          reply: "Chat configuration error. Please contact the site owner.",
        });
      }

      // Retry on transient errors (network, timeout, 500)
      if (attempt < maxRetries && (msg.includes("timeout") || msg.includes("500") || msg.includes("fetch") || msg.includes("econnreset"))) {
        await new Promise((r) => setTimeout(r, 500 * attempt));
        continue;
      }

      break;
    }
  }

  console.error("Chat API error:", lastError);
  return res.status(500).json({
    reply: "Something went wrong 😭 Try again in a moment.",
  });
};
