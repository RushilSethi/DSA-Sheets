import type { Metadata } from "next";
import { Open_Sans, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { ProgressMigration } from "@/components/ProgressMigration";
import { AppLogo } from "@/components/AppLogo";
import { MakerFooterOverlay } from "@/components/MakerFooterOverlay";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DSA Sheets – DSA Progress Tracker",
  description: "Master Data Structures and Algorithms with your favorite sheets",
  icons: {
    icon: "/logo_small.png",
    apple: "/logo_small.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${openSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <ProgressMigration />
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="text-2xl font-extrabold flex items-center gap-3">
              <AppLogo size={40} priority />
              <span>
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  DSA
                </span>
                <span className="text-white"> Sheets</span>
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
                <Link href="/random" className="text-sm font-medium hover:text-primary transition-colors">Random</Link>
                <Link href="/bookmarks" className="text-sm font-medium hover:text-primary transition-colors">Bookmarks</Link>
                <Link href="/sheet/450dsa" className="text-sm font-medium hover:text-primary transition-colors">450 DSA</Link>
                <Link href="/sheet/neetcode150" className="text-sm font-medium hover:text-primary transition-colors">Neetcode 150</Link>
                <Link href="/sheet/strivers-sde" className="text-sm font-medium hover:text-primary transition-colors">Striver SDE</Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="flex-1 container mx-auto px-4 py-8 pb-20">
          {children}
        </main>
        <footer className="border-t bg-card py-5 pb-16">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <Link
              href="/attribution"
              className="hover:text-primary transition-colors underline-offset-4 hover:underline"
            >
              Attribution &amp; Disclaimer
            </Link>
          </div>
        </footer>
        <MakerFooterOverlay />
      </body>
    </html>
  );
}
