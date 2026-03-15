import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Question Ingestion - Canvas Classes",
  description: "Admin workspace for question management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
