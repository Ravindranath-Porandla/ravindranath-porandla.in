import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ravindranath Porandla — AI Engineer",
    template: "%s — Ravindranath Porandla",
  },
  description:
    "AI Engineer building production ML systems. Writing about MLOps, LLMs, and the craft of shipping models that work.",
  keywords: ["AI Engineer", "Machine Learning", "MLOps", "LLMs", "Python", "FastAPI"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={geistMono.variable}
        style={{ width: "100%", margin: 0, padding: 0 }}
      >
        <ThemeProvider>
          <div style={{ display: "flex", flexDirection: "column", minHeight: "100svh", width: "100%" }}>
            <Navbar />
            <main style={{ flex: 1, width: "100%" }}>{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
