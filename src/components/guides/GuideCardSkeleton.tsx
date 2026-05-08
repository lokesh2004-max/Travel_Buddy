import React from 'react';

const GuideCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-3xl shadow-lg overflow-hidden animate-pulse">
    <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-100" />
    <div className="p-5 space-y-3">
      <div className="flex justify-between">
        <div className="h-4 w-20 bg-gray-200 rounded" />
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </div>
      <div className="h-3 w-full bg-gray-100 rounded" />
      <div className="flex gap-2">
        <div className="h-5 w-14 bg-gray-100 rounded-full" />
        <div className="h-5 w-12 bg-gray-100 rounded-full" />
      </div>
    </div>
  </div>
);

export default GuideCardSkeleton;
