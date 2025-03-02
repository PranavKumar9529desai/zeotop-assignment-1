'use client';

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="space-y-4">
        <div className="w-48 h-2 bg-gray-200 rounded animate-pulse" />
        <div className="w-32 h-2 bg-gray-200 rounded animate-pulse" />
        <div className="w-40 h-2 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
} 