'use client';

import SetupGate from '@/components/SetupGate';

export default function ClientGate({ children }: { children: React.ReactNode }) {
  return <SetupGate>{children}</SetupGate>;
}
