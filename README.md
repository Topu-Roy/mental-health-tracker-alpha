# Mental Health Tracker

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Alpha-orange.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.0-black)
![React](https://img.shields.io/badge/React-19.0-blue)

**Your personal companion for mental well-being.**

Mental Health Tracker is a modern, privacy-focused application designed to help you understand your emotional journey. Track your moods, journal your thoughts, and receive personalized, AI-powered encouragement to build resilience and mindfulness.

## ✨ Features

- **Daily Check-ins**: Quick and intuitive mood tracking to capture how you're feeling every day.
- **Smart Journaling**: A distraction-free space to write down your thoughts, with rich text support.
- **AI-Powered Insights**: Receive personalized encouragement and insights based on your check-ins and journal entries.
- **Gamification**: Build healthy habits with streak tracking and visual progress indicators.
- **Privacy First**: Your data is yours. Secure authentication and private data handling.
- **Beautiful UI**: Built with a modern, accessible design system using Shadcn UI and Tailwind CSS.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)
- **AI Integration**: [Vercel AI SDK](https://sdk.vercel.ai/docs)

## 🚀 Getting Started

Follow these steps to get the project running on your local machine.

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (Recommended package manager)
- **PostgreSQL** database (Local or hosted)

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/Topu-Roy/mental-health-tracker-alpha.git
    cd mental-health-tracker-alpha
    ```

2.  **Install dependencies**

    ```bash
    pnpm install
    ```

3.  **Set up Environment Variables**
    Create a `.env` file in the root directory and add the following variables:

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/mental_health_db"
    BETTER_AUTH_SECRET="your_super_secret_key"
    BETTER_AUTH_URL="http://localhost:3000"
    GOOGLE_GENERATIVE_AI_API_KEY="your_gemini_api_key"
    ```

4.  **Initialize the Database**

    ```bash
    pnpm db:push
    ```

5.  **Run the Development Server**

    ```bash
    pnpm dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
