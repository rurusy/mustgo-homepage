"use client";

type HeroProps = {
  onOpenAbout: () => void;
};

const stats = [
  { value: "700", suffix: "+", label: "연간 기업 행사 진행" },
  { value: "3,500", suffix: "명", label: "해외 VIP 고객 케어" },
  { value: "15", suffix: "년", label: "MICE 현장 경험" },
];

export default function Hero({ onOpenAbout }: HeroProps) {
  return (
    <section
      aria-labelledby="hero-title"
      className="flex-1 flex flex-col justify-center w-full max-w-[1440px] mx-auto px-[5vw] pt-8 pb-20"
    >
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <div className="inline-flex items-center px-3 py-1.5 bg-brand-blue/10 border border-brand-blue/20 rounded text-brand-blue text-xs font-bold tracking-wider uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-blue shadow-[0_0_8px_#42A5F5] mr-2" />
            대구·경북 MICE 전문
          </div>

          <h1
            id="hero-title"
            className="text-[clamp(2.5rem,4vw,4rem)] font-extrabold leading-[1.15] tracking-tight mb-6 break-keep"
          >
            기업 행사, 처음부터 끝까지
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-brand inline-block">
              한 팀이 책임집니다
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-[90%] break-keep leading-[1.6]">
            공항 의전부터 컨벤션 운영까지 — 행사 담당자 혼자{" "}
            <strong className="text-gray-900 font-semibold">
              7개 업체를 조율하던 시간
            </strong>
            을 <strong className="font-bold text-orange-500">MUSTGO 한 곳</strong>으로 줄여드립니다.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#cta"
              onClick={(e) => {
                // 기본 해시 점프 대신 부드러운 스크롤 후 첫 입력에 포커스 이동.
                // 키보드/스크린리더 사용자가 폼에 바로 진입할 수 있도록 보조.
                const target = document.getElementById("cta");
                if (!target) return;
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
                // 스크롤 애니메이션이 끝난 뒤 포커스
                window.setTimeout(() => {
                  const firstInput = document.getElementById("cta-name");
                  (firstInput as HTMLInputElement | null)?.focus({
                    preventScroll: true,
                  });
                }, 600);
              }}
              className="relative inline-flex items-center justify-center w-40 px-4 py-4 text-[0.9375rem] font-semibold rounded-lg bg-gradient-brand text-white shadow-[0_4px_14px_rgba(66,165,245,0.3)] hover:shadow-[0_6px_20px_rgba(139,195,74,0.4)] hover:-translate-y-0.5 transition-all duration-300 ease-out-expo overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
            >
              <span className="relative z-10">상담신청</span>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center w-40 px-4 py-4 text-[0.9375rem] font-semibold rounded-lg text-gray-900 border border-gray-300 hover:border-gray-900 hover:bg-white transition-colors duration-300 ease-out-expo bg-transparent"
            >
              주요 서비스
            </a>
            <button
              type="button"
              onClick={onOpenAbout}
              className="inline-flex items-center justify-center w-40 px-4 py-4 text-[0.9375rem] font-semibold rounded-lg text-gray-900 border border-gray-300 hover:border-gray-900 hover:bg-white transition-colors duration-300 ease-out-expo bg-transparent"
            >
              About MUSTGO
            </button>
          </div>
        </div>

        <div className="flex justify-start lg:justify-end h-full items-center">
          <div
            className="relative w-full max-w-[400px] lg:max-w-[420px] overflow-hidden border border-white/80 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)] bg-cover bg-center"
            style={{ backgroundImage: "url('/0.jpg')" }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-white/50"
            />
            <div className="relative grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6 sm:gap-4 lg:gap-0 p-8 lg:p-10">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`flex flex-col gap-2 ${
                    i < stats.length - 1
                      ? "sm:border-r lg:border-r-0 lg:border-b border-black/15 lg:pb-6 lg:mb-6 sm:pr-4 lg:pr-0"
                      : ""
                  }`}
                >
                  <div className="text-[2rem] lg:text-[2.5rem] font-extrabold tracking-tight text-gray-900 flex items-baseline gap-1 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                    {s.value}
                    <span
                      className="text-base font-bold"
                      style={{
                        color: "#1565C0",
                        textShadow:
                          "0 0 6px rgba(255,255,255,0.95), 0 1px 2px rgba(255,255,255,0.9)",
                      }}
                    >
                      {s.suffix}
                    </span>
                  </div>
                  <div
                    className="text-sm font-bold text-gray-900"
                    style={{
                      textShadow:
                        "0 0 6px rgba(255,255,255,0.95), 0 0 14px rgba(255,255,255,0.8), 0 1px 2px rgba(255,255,255,0.9)",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
