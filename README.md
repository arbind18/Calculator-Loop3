# 🧮 Calculator Loop - Next.js Edition

## 300+ Free Online Calculators

A modern, fast, and feature-rich calculator hub built with Next.js 14, TypeScript, and Tailwind CSS.

## ✨ Features

- 🚀 **300+ Calculators** across 10 categories
- 💨 **Lightning Fast** - Server Components & Static Generation
- 🎨 **Beautiful UI** - Smooth animations with Framer Motion
- 🌗 **Dark Mode** - System-aware theme switching
- 📱 **Fully Responsive** - Mobile-first design
- 🔍 **Smart Search** - Real-time autocomplete
- 📊 **Analytics** - Track usage and popular calculators
- 🔐 **Authentication** - NextAuth.js integration
- 💾 **Save History** - PostgreSQL database with Prisma
- ⚡ **Optimized** - Perfect Lighthouse scores

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **State**: Zustand
- **Database**: PostgreSQL + Prisma
- **Auth**: NextAuth.js
- **Deployment**: Vercel

## 📦 Installation

```bash
# Install dependencies
npm install

# Setup database
npm run db:push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
├── lib/             # Utilities & helpers
├── store/           # Zustand stores
├── types/           # TypeScript types
└── data/            # Static data
```

## 🚀 Deployment

```bash
# Build for production
npm run build

# Start production server
npm start

# Or deploy to Vercel
vercel --prod
```

## 📝 Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```env
DATABASE_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
```

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing


Built with ❤️ by Calculator Loop Team
