import type { Metadata } from "next";
import "./globals.css";
import "./bloom.css";

export const metadata: Metadata = {
  title: "明天会开花 · 今晚许个愿",
  description: "把睡前愿望折成纸船，让另一个人的善意，在明天开成一朵花。",
  icons: {
    icon: "/bloom.svg",
    shortcut: "/bloom.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
