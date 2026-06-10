import type { Metadata } from "next";
import { Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import messages from "@/messages/zh.json";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import CampaignBanner from "@/components/ui/CampaignBanner";
import { MemberProvider } from "@/lib/member-context";
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
  metadataBase: new URL('https://yongyucraft.com'),
  title: {
    default: '永裕工藝 · 手工金工精品',
    template: `%s | ${messages.meta.siteName}`,
  },
  description: '台灣手工金工精品，每一道工序都承載著心意',
  openGraph: {
    type: "website",
    locale: "zh_TW",
    siteName: '永裕工藝',
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
      <body>
        <MemberProvider>
          <CampaignBanner />
          <CustomCursor />
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </MemberProvider>
      </body>
    </html>
  );
}
