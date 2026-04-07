import SmoothScrollProvider from "@/components/Providers/SmoothScrollProvider";
import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Achyuta Arnab Dey | Creative Web Developer",
  description:
    "Portfolio of Achyuta Arnab Dey, a creative web developer specializing in Next.js and architectural brutalism.",
  icons: {
    icon: "/logo/logo.jpg",
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
      className="h-full antialiased selection:bg-foreground selection:text-background"
    >
      <body className={`${syne.variable} ${inter.variable} min-h-full font-inter`}>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
