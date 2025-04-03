# 🧠 AI Tutor Frontend (Next.js + Supabase + LangChain)

This is the **frontend** of the AI Tutor project, built with **Next.js**, **TypeScript**, and **Tailwind CSS**, and powered by **Supabase** for authentication and a custom **Python LangChain API** for AI tutoring.

Users can choose a subject, receive engaging lessons from an AI tutor, take quizzes, and receive feedback based on their performance. This frontend is optimized for mobile-first use and deployed via **Vercel**.

---

## 🌐 Live Demo

> Check it out! — [Deployed via Vercel](https://ai-tutor-senior-project.vercel.app/)

---

## 📁 Folder Overview

```
AI_Tutor_SeniorProject/
├── app/                   # Next.js app directory with routes (e.g. /chat, /signin)
├── components/            # Reusable React components
├── lib/                   # Supabase client, utilities
├── public/                # Static assets
├── styles/                # Tailwind & global CSS
├── .env.local             # Local environment variables (not committed)
├── next.config.js         # Next.js config
└── tsconfig.json          # TypeScript settings
```

---

## ⚙️ Technologies Used

- **Next.js 14+ (App Router)**
- **React + TypeScript**
- **Tailwind CSS**
- **Supabase** (auth & DB)
- **Vercel** (deployment)
- **Custom LangChain Python API** (hosted on Render)

---

## 🚀 Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/ECampbell37/AI_Tutor_SeniorProject.git
cd AI_Tutor_SeniorProject
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Add environment variables

Create a `.env.local` file in the root:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXTAUTH_SECRET=your_auth_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_PYTHON_API=https://your-python-api.onrender.com
```

### 4. Start the dev server

```bash
npm run dev
```

Visit:  
`http://localhost:3000`

---

## 🔐 Authentication

This app uses **NextAuth.js** with Supabase as the user database and `CredentialsProvider` for manual login.

> You can configure additional providers or use Supabase OAuth.

---

## 📡 API Connection

The app sends requests to a **Python LangChain API** hosted separately (e.g., Render):

```ts
fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/intro?subject=Biology`)
```

Update the `NEXT_PUBLIC_PYTHON_API` value in `.env.local` when deploying.

---

## 📦 Deployment

### ✅ Frontend (Vercel)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import project → Add environment variables
4. Click **Deploy**

### ✅ Backend (Render)

Your LangChain API is deployed separately to [Render](https://render.com).

---

## 🧠 Features

- AI tutoring with custom subject support
- Adaptive quiz generation & grading
- Memory-based conversations
- Mobile-friendly chat UI
- Auth-protected routes and sessions

---

## 📈 Planned Features

- Analytics dashboard
- Mastery tracking with badges
- Kids vs Adults mode
- Offline mode with caching

---

## 🙌 Credits

Built by [Elijah Campbell-Ihim](https://github.com/ECampbell37) as a senior project for Computer Science.

Powered by:
- OpenAI
- LangChain
- Supabase
- Vercel
- Render

---
