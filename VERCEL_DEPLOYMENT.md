# Deploy Your Portfolio to Vercel (Step-by-Step)

This guide will get your portfolio live on Vercel with **all features working**, including the **GlazyCode chatbot** that uses the Gemini API.

---

## What Was Done for You

- **Chat API on Vercel**: The chatbot backend is now a Vercel serverless function at `api/chat.js`. It runs on Vercel’s servers when someone sends a message.
- **Frontend**: The chat widget calls `/api/chat` (same domain), so it works on your live site without changing the URL.
- **Secrets**: Your Gemini API key is **not** in the code. You’ll add it in Vercel’s dashboard so the chatbot works in production.

---

## Prerequisites

1. **Git** installed on your computer.
2. **GitHub account** (free): [github.com](https://github.com).
3. **Vercel account** (free): [vercel.com](https://vercel.com) — sign up with GitHub.
4. **Gemini API key**: Get one at [Google AI Studio](https://aistudio.google.com/apikey) if you don’t have it yet.

---

## Step 1: Put Your Project on GitHub

1. Open [github.com](https://github.com) and log in.
2. Click the **+** (top right) → **New repository**.
3. Name it (e.g. `portfolio`), set to **Public**, then click **Create repository**.
4. On your computer, open a terminal in your project folder:
   ```bash
   cd "c:\Users\User\Desktop\test - Copy"
   ```
5. Initialize Git and push (replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repo name):
   ```bash
   git init
   git add .
   git commit -m "Portfolio with chatbot ready for Vercel"
   git branch -M main
 
                 
   git push -u origin main
   ```
   If Git asks you to log in, use your GitHub username and a **Personal Access Token** as the password (Settings → Developer settings → Personal access tokens).

**Important:** Do **not** commit the `chatbot/.env` file. The `.gitignore` already excludes `.env`, so `git add .` will not add it. Your API key will only live in Vercel.

---

## Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with **GitHub**.
2. Click **Add New…** → **Project**.
3. **Import** the repository you just created (e.g. `portfolio`).
4. Leave the settings as:
   - **Framework Preset**: Other
   - **Root Directory**: . (leave default)
   - **Build Command**: leave empty
   - **Output Directory**: leave empty (Vercel will serve your HTML/CSS/JS and the `api` folder)
5. Before clicking **Deploy**, open **Environment Variables**:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: paste your Gemini API key (same as in `chatbot/.env`).
   - **Environment**: Production (and optionally Preview).
6. Click **Deploy**.
7. Wait for the build to finish. You’ll get a URL like `https://your-project.vercel.app`.

---

## Step 3: Check That Everything Works

1. Open your Vercel URL (e.g. `https://your-project.vercel.app`).
2. Click through:
   - Home
   - About
   - Projects
   - Certificates
   - Resume
   - Contact
3. Open the **chat widget** (e.g. the 💬 button), type a message, and send.
   - If the bot replies, the chatbot and API are working.

If the chat says something like “Chat is not configured” or “Something went wrong”, go to **Step 4**.

---

## Step 4: Fix Chat (Environment Variable)

1. In Vercel, open your project → **Settings** → **Environment Variables**.
2. Ensure there is a variable:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: your real Gemini API key
   - **Environments**: at least **Production** (and Preview if you want it on preview URLs).
3. **Redeploy** so the new variable is applied:
   - **Deployments** tab → **⋯** on the latest deployment → **Redeploy**.

After the redeploy, test the chat again.

---

## Step 5: Custom Domain (Optional)

1. In your Vercel project, go to **Settings** → **Domains**.
2. Add your domain (e.g. `www.yoursite.com`) and follow the DNS instructions.
3. Once DNS is set, Vercel will serve your portfolio and the chatbot will still use `/api/chat` on the same domain.

---

## Summary

| What                | Where / How                                      |
|---------------------|--------------------------------------------------|
| Static site         | Served by Vercel (HTML, CSS, JS, images)         |
| Chat API            | `api/chat.js` → POST `/api/chat` (serverless)    |
| Gemini API key      | Only in Vercel **Environment Variables**        |
| Local dev chatbot   | Run `node chatbot/server.js` and use site locally|

---

## Local Development

- **Site only**: Open `index.html` in a browser or use a simple static server.
- **Site + chat (same as production)**: Install Vercel CLI and run the project locally so `/api/chat` works:
  ```bash
  npm i -g vercel
  cd "c:\Users\User\Desktop\test - Copy"
  npm install
  vercel dev
  ```
  Create a `.env.local` in the project root with `GEMINI_API_KEY=your_key`. Then open the URL shown (e.g. http://localhost:3000). The chat will use the same `/api/chat` as on Vercel.
- **Alternative**: Run the original Express chatbot for local testing:
  ```bash
  cd chatbot
  npm install
  node server.js
  ```
  Then in `js/glazycode-chat/chatbot.js` temporarily change the fetch URL back to `http://localhost:3000/chat` for local testing. Remember to change it back to `/api/chat` before pushing to GitHub so production keeps working.

---

## Troubleshooting

- **Chat returns 500 or “not configured”**  
  Add or fix `GEMINI_API_KEY` in Vercel Environment Variables and redeploy.

- **Other pages (About, Projects, etc.) 404**  
  Make sure you didn’t remove or change `vercel.json` in a way that rewrites all routes. The current `vercel.json` only sets `"version": 2` and lets Vercel serve your files normally.

- **CORS errors in browser**  
  The `api/chat.js` handler already sends `Access-Control-Allow-Origin: *`. If you use a custom domain, it should still work; if you see CORS errors, say which URL you’re opening and we can narrow it down.

You’re done. Your portfolio is on Vercel with the chatbot working via the Gemini API.
