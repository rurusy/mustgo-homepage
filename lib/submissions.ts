export type Submission = {
  id: string;
  createdAt: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  eventType: string;
  memo: string;
};

export type SubmissionRow = {
  id: string;
  created_at: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  event_type: string;
  memo: string;
};

export const rowToSubmission = (r: SubmissionRow): Submission => ({
  id: r.id,
  createdAt: r.created_at,
  name: r.name,
  company: r.company,
  phone: r.phone,
  email: r.email,
  eventType: r.event_type,
  memo: r.memo ?? "",
});

export const EVENT_TYPES: { value: string; label: string }[] = [
  { value: "workshop", label: "기업 워크숍·세미나" },
  { value: "incentive", label: "포상관광·인센티브 투어" },
  { value: "convention", label: "컨벤션·전시회" },
  { value: "vip", label: "VIP 의전·수송" },
  { value: "airline", label: "상용 항공 업무" },
  { value: "other", label: "기타" },
];

export const EVENT_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  EVENT_TYPES.map((t) => [t.value, t.label])
);
