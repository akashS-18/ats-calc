import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Toaster } from "sonner";
import HistoryDrawer from "@/components/shared/HistoryDrawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ATS Resume Score Calculator — Optimize Your Resume",
  description: "Instantly analyze your resume against any job description. Get a detailed ATS compatibility score, keyword analysis, and actionable suggestions to land more interviews.",
  keywords: ["ATS", "resume", "score", "calculator", "keywords", "job", "interview"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <Navbar />
        {children}
        <Footer />
        <HistoryDrawer />
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--surface)',
              border: '1px solid var(--surface-border)',
              color: 'var(--foreground)',
            },
          }}
        />
      </body>
    </html>
  );
}
