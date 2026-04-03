import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calorie Balance Tracker",
  description: "Track calories eaten, calories burned, and your daily net balance.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CalorieTracker",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
