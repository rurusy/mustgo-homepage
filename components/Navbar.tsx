"use client";

import Logo from "./Logo";

export default function Navbar() {
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // 상단으로 부드럽게 스크롤. URL에 `#`이 남지 않도록 pushState 사용.
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (window.history && window.location.hash) {
      window.history.pushState(
        "",
        document.title,
        window.location.pathname + window.location.search
      );
    }
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-gray-900 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
      >
        본문으로 바로가기
      </a>
      <nav className="w-full max-w-[1440px] mx-auto px-[5vw] py-8 flex justify-between items-center">
        <a
          href="#top"
          onClick={handleLogoClick}
          className="inline-block rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
          aria-label="MUSTGO 홈 — 맨 위로"
        >
          <Logo />
        </a>
      </nav>
    </>
  );
}
