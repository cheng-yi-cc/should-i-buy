'use client';

interface VerdictStampProps {
  verdict: '买' | '不买';
  itemName: string;
  price: string;
}

export default function VerdictStamp({ verdict, itemName, price }: VerdictStampProps) {
  const isBuy = verdict === '买';

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Stamp */}
      <div className="relative" style={{ width: 120, height: 120 }}>
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border border-accent/30"
          style={{ transform: 'rotate(-12deg)' }}
        />
        {/* Inner stamp */}
        <div
          className="absolute rounded-full border-[3px] border-accent flex items-center justify-center bg-surface"
          style={{
            width: 100,
            height: 100,
            top: 10,
            left: 10,
            animation: 'stampIn 0.5s ease-out forwards',
          }}
        >
          <span className="text-4xl font-bold text-accent select-none">
            {verdict}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text">{itemName}</h2>
        <p className="font-mono text-sm text-text-muted mt-1">{price}</p>
      </div>
    </div>
  );
}
