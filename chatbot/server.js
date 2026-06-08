require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

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
Your journey into development started during college, where you learned by doing—building web systems, a personal portfolio, and your first mobile app using Flutter, a habit tracker called “GymBro.”
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

function createChat() {
  return model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: SYSTEM_PROMPT }],
      },
    ],
  });
}

let chat = createChat();

// Queue: only one chat request at a time so spam doesn't corrupt the session
let chatQueue = Promise.resolve();

function sendChatMessage(userMessage) {
  return new Promise((resolve, reject) => {
    chatQueue = chatQueue
      .then(() => chat.sendMessage(userMessage))
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
}

// Restart chat if we hit context/history limits or session gets into a bad state
function maybeRestartChat(err) {
  const msg = (err && err.message) ? err.message : String(err);
  const isContextOrResource =
    /resource exhausted|context|quota|invalid state|429/i.test(msg);
  if (isContextOrResource) {
    console.warn("Restarting chat session after error:", msg);
    chat = createChat();
  }
}

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage || typeof userMessage !== "string") {
      return res.status(400).json({ reply: "Please send a valid message." });
    }
    const result = await sendChatMessage(userMessage.trim());
    res.json({ reply: result.response.text() });
  } catch (err) {
    console.error(err);
    maybeRestartChat(err);
    res.status(500).json({ reply: "Something went wrong 😭 Try again in a moment." });
  }
});

app.get("/", (req, res) => {
  res.send("🔥 GlazyCode Gemini API is running");
});


app.listen(3000, () => {
  console.log("🔥 Gemini backend running on http://localhost:3000");
});

