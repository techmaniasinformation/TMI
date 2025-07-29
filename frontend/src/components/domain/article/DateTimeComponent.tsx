import React from 'react';

interface DateTimeComponentProps {
  date: string;
  formatDate: (date: string) => string;
}

export default function DateTimeComponent({ 
  date, 
  formatDate 
}: DateTimeComponentProps) {
  return (
    <span className="text-sm text-gray-500">
      {formatDate(date)}
    </span>
  );
} 