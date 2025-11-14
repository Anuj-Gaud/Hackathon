# Worldz - Modern Job Platform

A modern job and internship platform that connects job seekers with employers, featuring a clean, Instagram-inspired design.

## Features

- 🔐 Authentication with Supabase
- 💼 Job and Internship Listings
- 📱 Responsive Design (Web + Mobile)
- 📊 Analytics Dashboard
- 💳 Subscription Management
- 📝 Job Posting System

## Tech Stack

- **Frontend Web**: Next.js + React + Tailwind CSS
- **Frontend Mobile**: React Native
- **Backend**: Node.js + Express
- **Database & Auth**: Supabase
- **State Management**: Redux Toolkit
- **Charts**: Recharts
- **Styling**: Tailwind CSS

## Project Structure

```
worldz/
├── apps/
│   ├── web/          # Next.js web application
│   └── mobile/       # React Native mobile app
├── packages/
│   ├── ui/           # Shared UI components
│   ├── config/       # Shared configuration
│   └── tsconfig/     # TypeScript configurations
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development servers:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 