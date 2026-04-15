import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-white/60 backdrop-blur-sm border-t border-white/60 relative z-10">
      <div className="max-w-[1440px] mx-auto px-[5vw] py-8 flex items-center justify-between gap-6">
        <Logo />
        <div className="flex flex-col items-end gap-2">
          <p className="text-sm text-gray-600">
            Copyright © 2026 MustGo Inc. All rights reserved.
          </p>
          <a
            href="/admin"
            className="text-xs font-semibold text-gray-500 hover:text-brand-blue border border-gray-300 hover:border-brand-blue rounded px-3 py-1 transition-colors"
          >
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
