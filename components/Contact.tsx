export default function Contact() {
  const address = "대구광역시 수성구 알파시티 1로 31길 19, 5F (MG 뉴턴 알파시티)";
  const mapQuery = encodeURIComponent("엠지뉴턴 알파시티");

  return (
    <section
      id="contact"
      className="bg-white/60 backdrop-blur-sm py-24 relative z-10 border-t border-white/60"
    >
      <div className="max-w-[1440px] mx-auto px-[5vw]">
        <div className="text-center mb-16">
          <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold tracking-tight text-gray-900 mb-4">
            Contact us
          </h2>
        </div>

        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl p-8 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <dl className="space-y-4 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
              <dt className="shrink-0 font-bold text-gray-900 sm:w-20">Address</dt>
              <dd className="text-gray-700 break-keep">
                <span className="text-gray-500 mr-2">42250</span>
                {address}
              </dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <dt className="shrink-0 font-bold text-gray-900 sm:w-20">Tel</dt>
              <dd className="text-gray-700">
                <a href="tel:0532555992" className="hover:text-brand-blue transition-colors">
                  053-255-5992
                </a>
              </dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <dt className="shrink-0 font-bold text-gray-900 sm:w-20">E-mail</dt>
              <dd className="text-gray-700">
                <a
                  href="mailto:jhlee@mustgokorea.com"
                  className="hover:text-brand-blue transition-colors"
                >
                  jhlee@mustgokorea.com
                </a>
              </dd>
            </div>
          </dl>

          <div className="rounded-xl overflow-hidden border border-gray-200 aspect-[16/9]">
            <iframe
              title="MUSTGO 오시는 길"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed&z=18`}
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0 }}
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
