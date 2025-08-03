import React from 'react';

export function CommentBadge({ count = 0 }: { count?: number }) {
  return (
    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
      💬 {count}
    </span>
  );
}

export function StarBadge({ count = 0 }: { count?: number }) {
  return (
    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
      ⭐ {count}
    </span>
  );
}

export function ViewBadge({ count = 0 }: { count?: number }) {
  return (
    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
      👁️ {count}
    </span>
  );
} 