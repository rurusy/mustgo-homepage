"use client";

import { useRef, useState } from "react";
import { EVENT_TYPES } from "@/lib/submissions";
import { supabase, CTA_TABLE } from "@/lib/supabase";

const INITIAL_FORM = {
  name: "",
  company: "",
  phone: "",
  email: "",
  eventType: "",
  memo: "",
};

// 지원 포맷: 010-0000-0000, 01000000000, +82-10-0000-0000, +821000000000
// 공백/하이픈/괄호는 모두 허용 후 제거하고 숫자 길이로 판정.
const validatePhone = (raw: string): boolean => {
  const v = raw.trim();
  if (!v) return false;
  // +82 국제 표기를 0으로 정규화
  const normalized = v.replace(/\s|-|\(|\)/g, "").replace(/^\+82/, "0");
  // 숫자만 남아야 함
  if (!/^\d+$/.test(normalized)) return false;
  // 한국 휴대/일반 전화 길이 (9~11자리)
  return normalized.length >= 9 && normalized.length <= 11;
};

const validateEmail = (raw: string): boolean => {
  const v = raw.trim();
  if (!v) return false;
  // 간단한 RFC 호환 검증
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
};

type FieldErrors = {
  phone?: string;
  email?: string;
};

export default function CTA() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const nameInputRef = useRef<HTMLInputElement>(null);

  const update =
    (k: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setForm((f) => ({ ...f, [k]: e.target.value }));
      // 입력 중에는 기존 에러만 제거 (재검증은 blur에서)
      if (k === "phone" && fieldErrors.phone) {
        setFieldErrors((fe) => ({ ...fe, phone: undefined }));
      }
      if (k === "email" && fieldErrors.email) {
        setFieldErrors((fe) => ({ ...fe, email: undefined }));
      }
    };

  const onPhoneBlur = () => {
    if (form.phone && !validatePhone(form.phone)) {
      setFieldErrors((fe) => ({
        ...fe,
        phone: "연락처 형식을 확인해주세요. 예) 010-1234-5678",
      }));
    }
  };

  const onEmailBlur = () => {
    if (form.email && !validateEmail(form.email)) {
      setFieldErrors((fe) => ({
        ...fe,
        email: "이메일 형식을 확인해주세요. 예) name@company.com",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitted || submitting) return;

    // Trim + 빈 값(공백만) 검증
    const trimmed = {
      name: form.name.trim(),
      company: form.company.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      eventType: form.eventType,
      memo: form.memo.trim(),
    };

    const nextErrors: FieldErrors = {};
    if (!validatePhone(trimmed.phone)) {
      nextErrors.phone = "연락처 형식을 확인해주세요. 예) 010-1234-5678";
    }
    if (!validateEmail(trimmed.email)) {
      nextErrors.email = "이메일 형식을 확인해주세요. 예) name@company.com";
    }
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    if (!trimmed.name || !trimmed.company || !trimmed.eventType) {
      setErrorMsg("필수 항목을 모두 입력해주세요.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    const { error } = await supabase.from(CTA_TABLE).insert({
      name: trimmed.name,
      company: trimmed.company,
      phone: trimmed.phone,
      email: trimmed.email,
      event_type: trimmed.eventType,
      memo: trimmed.memo,
    });

    setSubmitting(false);

    if (error) {
      setErrorMsg(
        "접수 중 문제가 발생했습니다. 잠시 후 다시 시도해주시거나, 전화(053-255-5992) 또는 이메일(jhlee@mustgokorea.com)로 문의해주세요."
      );
      return;
    }

    setForm(INITIAL_FORM);
    setFieldErrors({});
    setSubmitted(true);
  };

  return (
    <section
      id="cta"
      style={{ scrollMarginTop: "80px" }}
      className="py-24 relative z-10 border-t border-white/20 bg-[linear-gradient(135deg,rgba(66,165,245,0.88)_0%,rgba(139,195,74,0.88)_100%)] backdrop-blur-sm"
    >
      <div className="max-w-[1440px] mx-auto px-[5vw]">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold tracking-tight text-white mb-4">
            행사 규모와 날짜만 알려주세요
          </h2>
          <p className="text-lg text-white/90">
            영업일 기준 1일 이내에 담당자가 연락드립니다.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
          {submitted ? (
            <div
              role="status"
              aria-live="polite"
              className="text-center py-10"
            >
              <div className="text-2xl font-extrabold text-gray-900 mb-3">
                신청이 접수되었습니다
              </div>
              <p className="text-gray-600 mb-2">
                영업일 기준 1일 이내에 담당자가 연락드립니다. 감사합니다.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                예상 답변 시간: 영업일 기준 1일 이내
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="inline-block py-3 px-6 rounded-lg bg-gradient-brand text-white font-semibold hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                >
                  새 상담 신청하기
                </button>
                <a
                  href="tel:0532555992"
                  className="inline-flex items-center py-3 px-6 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                  aria-label="급한 문의는 053-255-5992로 전화"
                >
                  급한 문의 053-255-5992
                </a>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="cta-name"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    담당자 성함 <span aria-hidden="true" className="text-red-500">*</span>
                  </label>
                  <input
                    id="cta-name"
                    ref={nameInputRef}
                    type="text"
                    required
                    maxLength={50}
                    autoComplete="name"
                    value={form.name}
                    onChange={update("name")}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-gray-900 placeholder-gray-400"
                    placeholder="이름을 입력해주세요"
                  />
                </div>
                <div>
                  <label
                    htmlFor="cta-company"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    회사명 <span aria-hidden="true" className="text-red-500">*</span>
                  </label>
                  <input
                    id="cta-company"
                    type="text"
                    required
                    maxLength={50}
                    autoComplete="organization"
                    value={form.company}
                    onChange={update("company")}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-gray-900 placeholder-gray-400"
                    placeholder="회사명을 입력해주세요"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="cta-phone"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    연락처 <span aria-hidden="true" className="text-red-500">*</span>
                  </label>
                  <input
                    id="cta-phone"
                    type="tel"
                    required
                    maxLength={20}
                    autoComplete="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={update("phone")}
                    onBlur={onPhoneBlur}
                    aria-invalid={!!fieldErrors.phone}
                    aria-describedby={fieldErrors.phone ? "cta-phone-error" : undefined}
                    className={`w-full px-4 py-3 rounded-lg border outline-none transition-all text-gray-900 placeholder-gray-400 ${
                      fieldErrors.phone
                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                    }`}
                    placeholder="010-0000-0000"
                  />
                  {fieldErrors.phone && (
                    <p
                      id="cta-phone-error"
                      role="alert"
                      className="mt-2 text-sm text-red-600"
                    >
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="cta-email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    이메일 <span aria-hidden="true" className="text-red-500">*</span>
                  </label>
                  <input
                    id="cta-email"
                    type="email"
                    required
                    maxLength={100}
                    autoComplete="email"
                    inputMode="email"
                    value={form.email}
                    onChange={update("email")}
                    onBlur={onEmailBlur}
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? "cta-email-error" : undefined}
                    className={`w-full px-4 py-3 rounded-lg border outline-none transition-all text-gray-900 placeholder-gray-400 ${
                      fieldErrors.email
                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                    }`}
                    placeholder="email@company.com"
                  />
                  {fieldErrors.email && (
                    <p
                      id="cta-email-error"
                      role="alert"
                      className="mt-2 text-sm text-red-600"
                    >
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="cta-event-type"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  행사 유형 선택 <span aria-hidden="true" className="text-red-500">*</span>
                </label>
                <select
                  id="cta-event-type"
                  required
                  value={form.eventType}
                  onChange={update("eventType")}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-gray-900 bg-white cursor-pointer"
                >
                  <option value="" disabled hidden>
                    행사 유형을 선택해주세요
                  </option>
                  {EVENT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="cta-memo"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  자유 메모
                </label>
                <textarea
                  id="cta-memo"
                  rows={4}
                  maxLength={1000}
                  value={form.memo}
                  onChange={update("memo")}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-gray-900 placeholder-gray-400 resize-none"
                  placeholder="행사 규모, 예정 날짜, 특이사항 등 자유롭게 작성해주세요"
                />
                <p className="mt-1 text-xs text-gray-400 text-right">
                  {form.memo.length}/1000
                </p>
              </div>

              {errorMsg && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={submitted || submitting}
                aria-label={submitting ? "상담 신청 접수 중, 잠시만 기다려주세요" : "상담 신청하기"}
                className="w-full py-4 px-8 rounded-lg bg-gradient-brand text-white font-semibold text-[1.0625rem] shadow-[0_4px_14px_rgba(66,165,245,0.4)] hover:shadow-[0_8px_25px_rgba(139,195,74,0.5)] hover:-translate-y-0.5 transition-all duration-300 ease-out-expo disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-blue"
              >
                {submitting ? "접수 중..." : "상담 신청하기"}
              </button>

              <p className="text-center text-sm text-gray-500">
                개인정보는 상담 목적 외에 사용되지 않습니다
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
