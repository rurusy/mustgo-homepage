const numbers = [
  { value: "700+", label: "연간 대규모 기업 행사", color: "border-brand-green" },
  { value: "1,800+", label: "누적 기업 출장 건수", color: "border-brand-blue" },
  {
    value: "3,500명",
    label: "당사 기획 5~8일 한국 체류 프로그램 이용 해외 VIP 고객",
    color: "border-gray-900",
  },
  { value: "15년", label: "MICE 현장 경험", color: "border-brand-green" },
  { value: "24h", label: "긴급 대응 체계 가동", color: "border-brand-blue" },
];

export default function NumbersBar() {
  return (
    <section className="bg-white/60 backdrop-blur-sm border-y border-white/60 py-12 relative z-10">
      <div className="max-w-[1440px] mx-auto px-[5vw] grid lg:grid-cols-[220px_1fr] gap-8 lg:gap-16 items-start">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.1em] text-gray-500 mb-2">
            MUSTGO by Numbers
          </h2>
          <p className="text-xl font-bold text-gray-900">숫자로 보는 MUSTGO</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {numbers.map((n) => (
            <div key={n.label} className={`border-l-2 ${n.color} pl-4`}>
              <div className="text-[1.75rem] font-extrabold text-gray-900 mb-1">
                {n.value}
              </div>
              <div className="text-[0.8125rem] text-gray-500 leading-[1.4] break-keep">
                {n.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
