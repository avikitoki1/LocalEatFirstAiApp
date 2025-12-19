
import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-4 animate-pulse border border-slate-100">
          <div className="h-40 bg-slate-200 rounded-xl mb-4"></div>
          <div className="h-6 bg-slate-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
};
