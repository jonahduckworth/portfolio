'use client';

import dynamic from 'next/dynamic';

const ParticleField = dynamic(() => import('@/components/ParticleField'), {
  ssr: false,
});

export function ParticleFieldWrapper() {
  return <ParticleField />;
}
