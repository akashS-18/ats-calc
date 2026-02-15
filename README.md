# ATS Resume Score Calculator

A powerful, privacy-focused resume analyzer that helps you optimize your resume for Applicant Tracking Systems (ATS). Built with Next.js 14, TypeScript, and Tailwind CSS.

![ATS Calculator Banner](/public/og-image.png)
LIVE AT : https://ats-calc.vercel.app

## 🚀 Features

-   **Instant Analysis**: Get a detailed score based on keywords, skills, formatting, and more.
-   **Client-Side Processing**: Your resume never leaves your browser. 100% private.
-   **Smart Suggestions**: Actionable feedback to improve your resume's impact.
-   **Keyword Matching**: See exactly which keywords you're missing from the job description.
-   **History**: Save and compare multiple analyses.

## 🛠️ Tech Stack

-   **Framework**: Next.js 14 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS + Framer Motion
-   **Parsing**: PDF.js / Mammoth.js
-   **Icons**: Lucide React

## 🏃‍♂️ Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/ats-calc.git
    cd ats-calc
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run development server**
    ```bash
    npm run dev
    ```

4.  **Open in browser**
    Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Deployment

### Deploy to Render

1.  Push your code to a GitHub repository.
2.  Create a new **Web Service** on Render.
3.  Connect your repository.
4.  Render will automatically detect the `render.yaml` file (or you can configure manually):
    -   **Build Command**: `npm install && npm run build`
    -   **Start Command**: `npm start`

### Deploy to Vercel

The easiest way to deploy is to use the [Vercel Platform](https://vercel.com/new).

## 📄 License

MIT
