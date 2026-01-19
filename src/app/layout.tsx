import type { Metadata } from "next";
import { Toaster } from 'sonner'
import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-ts-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Typing Speed Test",
  description: "Typing speed test application to improve your typing skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} antialiased min-h-screen bg-ts-neutral-900`}
      >
        <h1 className="sr-only">Typing Speed Test by Frontendmentor 30 Days Hackathon</h1>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
