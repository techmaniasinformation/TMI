import React from 'react';

interface DateTimeComponentProps {
  date: string;
  formatDate: (date: string) => string;
}

const DateTimeComponent: React.FC<DateTimeComponentProps> = ({ 
  date, 
  formatDate 
}) => {
  return (
    <span className="text-sm text-gray-500">
      {formatDate(date)}
    </span>
  );
};

export { DateTimeComponent }; 