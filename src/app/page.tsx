import { Spreadsheet } from '@/components/spreadsheet/spreadsheet';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Spreadsheet',
};

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour if needed

export default function Home() {
  return (
    <main className="flex flex-col h-screen bg-gray-50">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="animate-pulse text-gray-600">Loading spreadsheet...</div>
          </div>
        }
      >
        <Spreadsheet />
      </Suspense>
    </main>
  );
}
