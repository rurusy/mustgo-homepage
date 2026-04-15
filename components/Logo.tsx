export default function Logo({ className = "h-[3.75rem] w-auto" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/mustgo_logo.png"
      alt="MUSTGO"
      width={255}
      height={75}
      decoding="async"
      fetchPriority="high"
      className={className}
      style={{ width: "auto", height: "3.75rem" }}
    />
  );
}
