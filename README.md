# 🧮 Calculator Loop - Next.js Edition

## Free Online Calculators

A modern, fast, and feature-rich calculator hub built with Next.js 14, TypeScript, and Tailwind CSS.

## ✨ Features

- 🚀 **Extensive Calculators** across 10 categories
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

### Google Login (OAuth)

This project uses NextAuth + Google provider. If you want the **Google** button to work:

1. Create/select a Google Cloud project
2. Configure **OAuth consent screen**
3. Create **OAuth client ID** → Application type: **Web application**
4. Add **Authorized redirect URIs**:
	- `http://localhost:3000/api/auth/callback/google`
	- `https://YOUR_DOMAIN/api/auth/callback/google`
5. Put the credentials in `.env.local`:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

If you see Google error `deleted_client`, it means the Client ID you are using was deleted/invalidated in Google Cloud — create a new OAuth client and update `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`, then restart the dev server.

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing


Built with ❤️ by Calculator Loop Team
