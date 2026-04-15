"use client";

import { useEffect, useMemo, useState } from "react";
import {
  EVENT_TYPE_LABELS,
  rowToSubmission,
  type Submission,
  type SubmissionRow,
} from "@/lib/submissions";
import { supabase, CTA_TABLE } from "@/lib/supabase";

// NOTE: Intentional prototype-only auth. This password is embedded in the
// client bundle and trivially inspectable — it is NOT real authentication.
// Replace with a server-side session/JWT flow before handling real data.
const ADMIN_PASSWORD = "mdtour2026@";

type ConfirmState = {
  title: string;
  message: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void | Promise<void>;
} | null;

type Toast = { id: number; text: string; tone: "success" | "error" } | null;

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwdError, setPwdError] = useState(false);
  const [items, setItems] = useState<Submission[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState>(null);
  const [toast, setToast] = useState<Toast>(null);

  const showToast = (text: string, tone: "success" | "error" = "success") => {
    const id = Date.now();
    setToast({ id, text, tone });
    window.setTimeout(() => {
      setToast((t) => (t?.id === id ? null : t));
    }, 3200);
  };

  useEffect(() => {
    if (!authed) return;
    reload();
  }, [authed]);

  const reload = async () => {
    setLoading(true);
    setLoadError(null);
    const { data, error } = await supabase
      .from(CTA_TABLE)
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      setLoadError("데이터를 불러오지 못했습니다.");
      setItems([]);
      return;
    }
    setItems(((data ?? []) as SubmissionRow[]).map(rowToSubmission));
    setLastUpdated(new Date());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd === ADMIN_PASSWORD) {
      setAuthed(true);
      setPwdError(false);
    } else {
      setPwdError(true);
    }
  };

  const removeOne = (id: string, name: string) => {
    setConfirmState({
      title: "접수건 삭제",
      message: `${name} 님의 접수건을 삭제할까요? 되돌릴 수 없습니다.`,
      confirmLabel: "삭제",
      danger: true,
      onConfirm: async () => {
        const { error } = await supabase.from(CTA_TABLE).delete().eq("id", id);
        if (error) {
          showToast("삭제에 실패했습니다. 잠시 후 다시 시도해주세요.", "error");
          return;
        }
        setItems((prev) => prev.filter((i) => i.id !== id));
        showToast("접수건을 삭제했습니다.");
      },
    });
  };

  const clearAll = () => {
    setConfirmState({
      title: "전체 접수건 삭제",
      message:
        "전체 접수건을 삭제합니다. 되돌릴 수 없으며 CSV로 내보낸 기록 외에는 복구가 불가능합니다. 계속할까요?",
      confirmLabel: "전체 삭제",
      danger: true,
      onConfirm: async () => {
        const { error } = await supabase
          .from(CTA_TABLE)
          .delete()
          .not("id", "is", null);
        if (error) {
          showToast("전체 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.", "error");
          return;
        }
        setItems([]);
        showToast("모든 접수건을 삭제했습니다.");
      },
    });
  };

  const exportCsv = () => {
    const header = ["일시", "이름", "회사", "연락처", "이메일", "행사유형", "메모"];
    const rows = items.map((i) => [
      new Date(i.createdAt).toLocaleString("ko-KR"),
      i.name,
      i.company,
      i.phone,
      i.email,
      EVENT_TYPE_LABELS[i.eventType] ?? i.eventType,
      i.memo.replace(/\n/g, " "),
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mustgo-submissions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) =>
      [i.name, i.company, i.phone, i.email, i.memo].some((v) =>
        v.toLowerCase().includes(q)
      )
    );
  }, [items, query]);

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-200"
        >
          <h1 className="text-xl font-bold text-gray-900 mb-6 text-center">
            관리자 로그인
          </h1>
          <input
            type="password"
            required
            autoFocus
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="비밀번호"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none text-gray-900"
          />
          {pwdError && (
            <p className="mt-3 text-sm text-red-600">비밀번호가 일치하지 않습니다.</p>
          )}
          <button
            type="submit"
            className="mt-6 w-full py-3 rounded-lg bg-gradient-brand text-white font-semibold"
          >
            입장
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">상담 접수 관리</h1>
            <p className="text-sm text-gray-500 mt-1">
              저장된 건수: <span className="font-semibold">{items.length}</span>
              {lastUpdated && (
                <>
                  <span className="mx-2 text-gray-300" aria-hidden="true">·</span>
                  <span>
                    마지막 업데이트:{" "}
                    <time dateTime={lastUpdated.toISOString()}>
                      {lastUpdated.toLocaleString("ko-KR")}
                    </time>
                  </span>
                </>
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setAuthed(false);
                setPwd("");
              }}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              로그아웃
            </button>
            <button
              onClick={reload}
              className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              새로고침
            </button>
            <button
              onClick={exportCsv}
              disabled={items.length === 0}
              className="px-4 py-2 rounded-lg bg-brand-blue text-white text-sm font-semibold disabled:opacity-40"
            >
              CSV 내보내기
            </button>
            <button
              onClick={clearAll}
              disabled={items.length === 0}
              className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold disabled:opacity-40"
            >
              전체 삭제
            </button>
          </div>
        </div>

        <input
          type="text"
          placeholder="이름·회사·연락처·이메일·메모로 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-lg border border-gray-200 bg-white outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
        />

        {loadError && (
          <div className="bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg px-4 py-3 mb-4">
            {loadError}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-gray-500">불러오는 중...</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              {items.length === 0 && query === "" ? (
                "아직 접수된 상담 신청이 없습니다."
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <p>&ldquo;{query}&rdquo; 에 해당하는 결과가 없습니다.</p>
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                  >
                    검색어 지우기
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">일시</th>
                    <th className="text-left px-4 py-3 font-semibold">이름</th>
                    <th className="text-left px-4 py-3 font-semibold">회사</th>
                    <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">연락처</th>
                    <th className="text-left px-4 py-3 font-semibold">이메일</th>
                    <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">행사유형</th>
                    <th className="text-left px-4 py-3 font-semibold">메모</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((i) => (
                    <tr key={i.id} className="border-t border-gray-100 align-top">
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {new Date(i.createdAt).toLocaleString("ko-KR")}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{i.name}</td>
                      <td className="px-4 py-3 text-gray-700">{i.company}</td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                        <a href={`tel:${i.phone}`} className="hover:underline">
                          {i.phone}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        <a href={`mailto:${i.email}`} className="hover:underline">
                          {i.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                        {EVENT_TYPE_LABELS[i.eventType] ?? i.eventType}
                      </td>
                      <td className="px-4 py-3 text-gray-700 max-w-xs break-keep whitespace-pre-wrap">
                        {i.memo || <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => removeOne(i.id, i.name)}
                          aria-label={`${i.name} 접수건 삭제`}
                          className="inline-flex items-center px-3 py-1.5 rounded-md border border-red-300 text-red-600 text-xs font-semibold hover:bg-red-50 hover:border-red-400 transition-colors"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 확인 모달 — confirm() 대신 사이트 디자인 톤에 맞춘 모달 사용 */}
      {confirmState && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-4"
          onClick={() => setConfirmState(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-200 p-6"
          >
            <h2
              id="confirm-title"
              className="text-lg font-extrabold text-gray-900 mb-2"
            >
              {confirmState.title}
            </h2>
            <p className="text-sm text-gray-600 mb-6 break-keep">
              {confirmState.message}
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmState(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
              >
                취소
              </button>
              <button
                type="button"
                autoFocus
                onClick={async () => {
                  const fn = confirmState.onConfirm;
                  setConfirmState(null);
                  await fn();
                }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  confirmState.danger
                    ? "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500"
                    : "bg-brand-blue hover:opacity-90 focus-visible:ring-brand-blue"
                }`}
              >
                {confirmState.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast — alert() 대체. 비차단적으로 성공/실패를 전달 */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-4 py-3 rounded-lg shadow-lg text-sm font-semibold text-white ${
            toast.tone === "error" ? "bg-red-600" : "bg-gray-900"
          }`}
        >
          {toast.text}
        </div>
      )}
    </main>
  );
}
