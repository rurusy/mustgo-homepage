const problems = [
  {
    n: 1,
    title: (
      <>
        평균 관리 업체 수 <span className="text-brand-blue">7개</span>
      </>
    ),
    body: "항공, 차량, 호텔, 식음료, 통역, 가이드, 전시 장비 — 각각 다른 업체와 계약하고 정산하다 보면 행사 당일에도 전화기를 놓지 못합니다.",
  },
  {
    n: 2,
    title: (
      <>
        D-3, VIP 의전 <span className="text-brand-blue">불안의 시작</span>
      </>
    ),
    body: "행사 3일 전부터 공항 픽업 차질, 통역 연락 두절, 동선 착오 걱정이 시작됩니다. 임원이나 해외 귀빈 앞에서의 실수는 회사 신뢰와 직결됩니다.",
  },
  {
    n: 3,
    title: (
      <>
        예산 초과 평균 <span className="text-brand-blue">+23%</span>
      </>
    ),
    body: "처음 받은 견적에는 없던 항목이 행사 후 정산서에 등장합니다. 숨겨진 비용과 뒤늦은 변경 요청으로 예산이 틀어지는 경험, 한 번쯤 있으셨을 겁니다.",
  },
  {
    n: 4,
    title: (
      <>
        대구·경북 현지 MICE 파트너,{" "}
        <span className="text-brand-blue">찾기가 더 어렵습니다</span>
      </>
    ),
    body: "서울 본사 이벤트사에 의뢰하면 현지 대응이 느리고 출장비가 따로 붙습니다. 그렇다고 대구·경북 지역 사정을 잘 아는 MICE 전문 업체를 찾는 것도 쉽지 않습니다. 행사 당일 돌발 상황이 생겼을 때 30분 안에 달려올 수 있는 팀이 필요합니다.",
  },
];

export default function Problem() {
  return (
    <section id="problem" className="bg-transparent py-24 relative z-10">
      <div className="max-w-[1440px] mx-auto px-[5vw]">
        <div className="text-center mb-16">
          <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold tracking-tight text-gray-900 mb-4">
            행사 담당자라면 공감할 4가지 현실
          </h2>
          <p className="text-lg text-gray-500">
            좋은 행사를 만들고 싶지만, 현실은 늘 이렇습니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {problems.map((p) => (
            <div
              key={p.n}
              className="bg-white border border-gray-200 rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out-expo"
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-brand flex items-center justify-center text-white font-extrabold text-xl">
                  {p.n}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {p.title}
                  </h3>
                  <p className="text-[0.9375rem] leading-[1.7] text-gray-500 break-keep">
                    {p.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
