const testimonials = [
  {
    stroke: "#42A5F5",
    initial: "김",
    quote:
      "작년에 독일 본사 임원 8명이 방한했을 때 공항 의전부터 경북 구미 공장 시찰, 저녁 만찬까지 MUSTGO에 맡겼습니다. 저는 카카오톡 한 채널만 보면 됐어요. 이전에는 같은 일을 하려고 5개 업체에 전화를 돌렸는데, 이번엔 전날 밤에도 잠을 잘 수 있었습니다.",
    name: "김지수",
    role: "어드민 매니저, 독일계 제조기업 한국법인",
  },
  {
    stroke: "#8BC34A",
    initial: "박",
    quote:
      "600명 규모 전사 워크숍을 처음 기획하면서 솔직히 막막했습니다. MUSTGO가 대구 엑스코(EXCO) 인근 장소 3곳을 비교 견적으로 바로 제안해줬고, 식음료·이동 차량·현장 스태프까지 하나의 계약서로 정리됐어요. 최종 정산도 견적 대비 2% 차이였습니다. 숨겨진 금액 없이.",
    name: "박성훈",
    role: "경영지원팀 과장, 중견 물류기업",
  },
];

function QuoteIcon({ stroke }: { stroke: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
    </svg>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-transparent py-24 relative z-10">
      <div className="max-w-[1440px] mx-auto px-[5vw]">
        <div className="text-center mb-16">
          <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold tracking-tight text-gray-900 mb-4">
            함께 일한 담당자들의 이야기
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white border border-gray-200 rounded-2xl p-8 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
            >
              <div className="mb-6">
                <QuoteIcon stroke={t.stroke} />
              </div>
              <p className="text-[1.0625rem] leading-[1.75] text-gray-700 mb-8 break-keep">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold text-sm">
                  {t.initial}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
