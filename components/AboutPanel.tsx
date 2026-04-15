"use client";

import { useEffect, useRef, useState, KeyboardEvent as ReactKeyboardEvent } from "react";

type Tab = "intro" | "history" | "org";

type Props = {
  open: boolean;
  onClose: () => void;
};

const tabs: { key: Tab; label: string }[] = [
  { key: "intro", label: "Company" },
  { key: "history", label: "History" },
  { key: "org", label: "Organization" },
];

const history = [
  {
    year: "2025",
    text: "인·아웃바운드 VIP 프로그램 누적 3,500명 달성",
    accent: true,
  },
  { year: "2024", text: "IATA BSP 인가 승인", accent: false },
  { year: "2020", text: "MUSTGO 법인 설립 · 상용 항공 업무 본격 개시", accent: false },
  { year: "2020", text: "MICE 종합 솔루션 사업 확장", accent: false },
  { year: "2010", text: "MUSTGO 전신 EVERYDAY TOUR 창립", accent: false },
];

const org = [
  { title: "MICE 사업부", sub: "기획팀 / 운영팀" },
  { title: "의전·수송 사업부", sub: "의전팀 / 투어팀" },
  { title: "항공·관광 사업부", sub: "항공팀 / 인바운드팀" },
];

export default function AboutPanel({ open, onClose }: Props) {
  const [tab, setTab] = useState<Tab>("intro");
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const tabRefs = useRef<Record<Tab, HTMLButtonElement | null>>({
    intro: null,
    history: null,
    org: null,
  });
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // `inert`는 React 18 타입에 없어 DOM에 직접 토글.
  // aria-hidden + 내부 포커스 충돌을 방지하기 위해 닫힌 상태에서 inert 적용.
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    if (open) {
      el.removeAttribute("inert");
    } else {
      el.setAttribute("inert", "");
    }
  }, [open]);

  // Focus management: move focus to close on open; restore to prior on close.
  useEffect(() => {
    if (open) {
      previouslyFocused.current = (document.activeElement as HTMLElement) ?? null;
      // Defer to next tick so the panel is painted and focusable.
      const t = window.setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 0);
      return () => window.clearTimeout(t);
    } else if (previouslyFocused.current) {
      const el = previouslyFocused.current;
      previouslyFocused.current = null;
      // Restore focus after close transition
      window.setTimeout(() => {
        try {
          el.focus();
        } catch {
          /* noop */
        }
      }, 0);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") {
        onClose();
        return;
      }
      // Basic focus trap
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const visible = Array.from(focusables).filter(
          (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1
        );
        if (visible.length === 0) return;
        const first = visible[0];
        const last = visible[visible.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey) {
          if (active === first || !panelRef.current.contains(active)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const onTabKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    const order: Tab[] = tabs.map((t) => t.key);
    const idx = order.indexOf(tab);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = order[(idx + 1) % order.length];
      setTab(next);
      tabRefs.current[next]?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = order[(idx - 1 + order.length) % order.length];
      setTab(prev);
      tabRefs.current[prev]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      setTab(order[0]);
      tabRefs.current[order[0]]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      const lastKey = order[order.length - 1];
      setTab(lastKey);
      tabRefs.current[lastKey]?.focus();
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        role="button"
        tabIndex={-1}
        aria-label="패널 닫기"
        aria-hidden="true"
        className={`fixed inset-0 bg-black/40 backdrop-blur-[4px] z-40 transition-all duration-400 ease-out-expo cursor-pointer ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-panel-title"
        // inert는 useEffect에서 DOM에 직접 토글 (React 18 타입 미지원 회피)
        className={`fixed z-50 bg-white shadow-[-20px_0_40px_rgba(0,0,0,0.1)] flex flex-col transition-transform duration-500 ease-out-expo
          md:top-0 md:right-0 md:h-screen md:w-full md:max-w-[600px]
          max-md:left-0 max-md:right-0 max-md:bottom-0 max-md:h-[85vh] max-md:rounded-t-[20px]
          ${
            open
              ? "md:translate-x-0 max-md:translate-y-0"
              : "md:translate-x-full max-md:translate-y-full"
          }`}
      >
        {/* 모바일 바텀시트용 grab handle — 아래로 스와이프해 닫을 수 있음을 시각적으로 암시 */}
        <div
          aria-hidden="true"
          className="hidden max-md:flex justify-center pt-2 pb-1 bg-white rounded-t-[20px]"
        >
          <span className="block w-10 h-1.5 rounded-full bg-gray-300" />
        </div>
        <div className="p-8 max-md:pt-4 border-b border-gray-200 flex justify-between items-center bg-white max-md:rounded-t-[0]">
          <div
            id="about-panel-title"
            className="text-2xl font-extrabold tracking-tight"
          >
            About MUSTGO
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="About MUSTGO 패널 닫기"
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div
          role="tablist"
          aria-label="About MUSTGO 섹션"
          className="flex px-8 border-b border-gray-200 gap-8"
        >
          {tabs.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                ref={(el) => {
                  tabRefs.current[t.key] = el;
                }}
                type="button"
                role="tab"
                id={`about-tab-${t.key}`}
                aria-selected={active}
                aria-controls={`about-tabpanel-${t.key}`}
                tabIndex={active ? 0 : -1}
                onClick={() => setTab(t.key)}
                onKeyDown={onTabKeyDown}
                className={`relative py-4 text-[0.9375rem] font-semibold transition-colors ${
                  active ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {t.label}
                <span
                  aria-hidden="true"
                  className={`absolute bottom-[-1px] left-0 w-full h-[2px] bg-brand-blue origin-left transition-transform duration-300 ${
                    active ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div className="flex-1 p-8 overflow-y-auto panel-scroll bg-white">
          {tab === "intro" && (
            <div
              role="tabpanel"
              id="about-tabpanel-intro"
              aria-labelledby="about-tab-intro"
              className="animate-fadeIn"
            >
              <p className="text-lg font-bold leading-[1.6] text-gray-900 mb-6">
                당사는 MICE 종합 솔루션 회사입니다.
              </p>
              <p className="text-base leading-[1.7] text-gray-600 mb-4 break-keep">
                당사는 회의·포상관광·컨벤션·전시 전 분야를 아우르는 MICE 종합
                솔루션 회사로, 행사 기획부터 대행, 그리고 의전·수송·관광·식음료
                등 현장 운영까지 전 과정(A to Z)을 체계적으로 지원합니다.
              </p>
              <p className="text-base leading-[1.7] text-gray-600 mb-4 break-keep">
                종합 여행사 운영 경험으로 구축한 글로벌 네트워크를 기반으로
                MICE 산업 지원 역량 강화 및 인바운드 사업을 확장해 왔으며,
                전문적인 항공 루팅과 합리적인 운임 제안, 빠른 대응으로 차별화된
                비즈니스 파트너십을 강화하고 있습니다. 이를 바탕으로 최근 3년
                간 67개국 이상의 네트워크와의 협업을 통해 다양한 기업 행사를
                성공적으로 수행해 왔습니다.
              </p>
              <p className="text-base leading-[1.7] text-gray-600 mb-8 break-keep">
                아울러 MICE를 통해 지역 경제 활성화와 도시 브랜드 가치 향상에
                기여하며 지속적인 성장을 이어가고 있습니다.
              </p>
              <dl className="grid grid-cols-3 gap-4 border-t border-gray-200 pt-6">
                <div>
                  <dt className="text-xs text-gray-500 mb-1">법인설립</dt>
                  <dd className="text-base font-bold text-gray-900">2020년</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500 mb-1">본사</dt>
                  <dd className="text-base font-bold text-gray-900">대구</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500 mb-1">연간 행사</dt>
                  <dd className="text-base font-bold text-gray-900">700+</dd>
                </div>
              </dl>
            </div>
          )}

          {tab === "history" && (
            <div
              role="tabpanel"
              id="about-tabpanel-history"
              aria-labelledby="about-tab-history"
              className="animate-fadeIn"
            >
              <div className="relative pl-6 before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:w-px before:bg-gray-200">
                {history.map((h, i) => (
                  <div key={i} className="relative mb-8 last:mb-0">
                    <div
                      aria-hidden="true"
                      className={`absolute -left-[1.8rem] top-[0.3rem] w-[9px] h-[9px] rounded-full z-10 ${
                        h.accent
                          ? "bg-brand-green border-2 border-brand-green"
                          : "bg-white border-2 border-brand-blue"
                      }`}
                    />
                    <div className="text-[0.875rem] font-bold text-gray-900 mb-1">
                      {h.year}
                    </div>
                    <div className="text-[0.9375rem] text-gray-600">
                      {h.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "org" && (
            <div
              role="tabpanel"
              id="about-tabpanel-org"
              aria-labelledby="about-tab-org"
              className="animate-fadeIn"
            >
              <div className="flex flex-col gap-6">
                <div className="bg-brand-green/10 border border-brand-green/30 p-4 rounded-lg text-center font-bold text-gray-900">
                  CEO (대표이사)
                </div>
                <div className="grid grid-cols-1 gap-4 pl-8 relative before:content-[''] before:absolute before:top-0 before:bottom-8 before:left-4 before:w-px before:bg-gray-200">
                  {org.map((o) => (
                    <div
                      key={o.title}
                      className="relative bg-gray-50 border border-gray-200 p-4 rounded-lg before:content-[''] before:absolute before:top-6 before:-left-4 before:w-4 before:h-px before:bg-gray-200"
                    >
                      <div className="font-semibold text-[0.9375rem] text-gray-900 mb-1">
                        {o.title}
                      </div>
                      <div className="text-[0.8125rem] text-gray-500">
                        {o.sub}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
