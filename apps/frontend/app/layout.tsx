import type { Metadata } from "next";
import { Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import messages from "@/messages/zh.json";
import "./globals.css";

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-noto-sans-tc",
  display: "swap",
});

const notoSerifTC = Noto_Serif_TC({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-noto-serif-tc",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: messages.meta.defaultTitle,
    template: `%s | ${messages.meta.siteName}`,
  },
  description: messages.meta.defaultDescription,
  openGraph: {
    type: "website",
    locale: "zh_TW",
    siteName: messages.meta.siteName,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-TW"
      className={`${notoSansTC.variable} ${notoSerifTC.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
