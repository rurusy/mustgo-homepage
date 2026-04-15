import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MUSTGO — 대구·경북 MICE 전문",
  description:
    "기업 행사, 처음부터 끝까지 한 팀이 책임집니다. 공항 의전부터 컨벤션 운영까지 MUSTGO의 MICE 종합 솔루션.",
};

const PRETENDARD_HREF =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css";

// Non-render-blocking load: link[media=print] doesn't block first paint; an
// inline script flips media to 'all' once loaded so Pretendard applies without
// delaying FCP. System-font fallback (tailwind.config sans stack) paints first.
const FONT_LOADER = `(function(){var l=document.createElement('link');l.rel='stylesheet';l.href=${JSON.stringify(
  PRETENDARD_HREF,
)};l.media='print';l.onload=function(){l.media='all'};document.head.appendChild(l);})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link
          rel="preconnect"
          href="https://fastly.jsdelivr.net"
          crossOrigin=""
        />
        <link rel="preload" as="image" href="/0.jpg" fetchPriority="high" />
        <link rel="preload" as="style" href={PRETENDARD_HREF} />
        <script dangerouslySetInnerHTML={{ __html: FONT_LOADER }} />
        <noscript>
          <link rel="stylesheet" href={PRETENDARD_HREF} />
        </noscript>
      </head>
      <body className="font-sans bg-brand-bg text-brand-black overflow-x-hidden antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
