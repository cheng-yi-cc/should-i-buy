export default function PageLabel({ text }: { text: string }) {
  return (
    <div className="font-mono text-[11px] tracking-[6px] uppercase text-text-muted mb-10 text-center">
      <span className="opacity-30 mr-3">&mdash;&mdash;</span>
      {text}
      <span className="opacity-30 ml-3">&mdash;&mdash;</span>
    </div>
  );
}
