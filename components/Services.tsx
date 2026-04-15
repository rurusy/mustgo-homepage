type Svc = {
  image: string;
  badge: string;
  badgeTone: "green" | "blue";
  title: string;
  body: string;
};

const services: Svc[] = [
  {
    image: "/1.jpg",
    badge: "준비 시간 40% 단축",
    badgeTone: "green",
    title: "MICE 행사 기획·운영",
    body: "기획안 작성부터 장소 섭외, 현장 MC, 식음료 조율, 철수까지 전 과정을 단일 팀이 담당합니다. 컨벤션·전시·기업 세미나 모두 가능합니다.",
  },
  {
    image: "/2.jpg",
    badge: "의전 클레임 0건 유지",
    badgeTone: "blue",
    title: "VIP 의전·수송·투어",
    body: "공항 픽업, 전용 차량 배차, 한·영·일·중 통역 가이드 동반, 맞춤 관광 일정까지 — 귀빈이 도착하는 순간부터 출국까지 수행합니다.",
  },
  {
    image: "/3.jpg",
    badge: "평균 항공비 8% 절감",
    badgeTone: "green",
    title: "상용 항공·인바운드 관광",
    body: "법인 항공권 발권·변경·정산 일괄 처리, 해외 참가자 국내 투어 일정 설계, 단체 예약 협상까지 — 출장·행사 항공 업무를 통합 관리합니다.",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="bg-white/60 backdrop-blur-sm py-24 relative z-10 border-t border-white/60"
    >
      <div className="max-w-[1440px] mx-auto px-[5vw]">
        <div className="text-center mb-16">
          <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold tracking-tight text-gray-900 mb-4">
            MUSTGO가 처리하는 것들
          </h2>
          <p className="text-lg text-gray-500">
            기획 단계부터 현장 철수까지, 담당자가 한 명만 연락하면 됩니다.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((s) => (
            <div
              key={s.title}
              className="bg-brand-bg border border-gray-200 rounded-2xl overflow-hidden hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out-expo group"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.image}
                  alt={s.title}
                  width={800}
                  height={500}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-105"
                />
              </div>
              <div className="p-8">
                <div className="mb-5">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded ${
                      s.badgeTone === "green"
                        ? "bg-brand-green/10 text-brand-green"
                        : "bg-brand-blue/10 text-brand-blue"
                    }`}
                  >
                    {s.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {s.title}
                </h3>
                <p className="text-[0.9375rem] leading-[1.7] text-gray-500 break-keep">
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
