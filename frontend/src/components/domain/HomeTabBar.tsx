import React from 'react';
import { Button } from '@/components/foundation/button';

interface HomeTabBarProps {
  activeTab: string;
  tabs: Array<{
    id: string;
    label: string;
    icon?: string;
  }>;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export default function HomeTabBar({
  activeTab,
  tabs,
  onTabChange,
  className = ''
}: HomeTabBarProps) {
  return (
    <div className={`mb-8 flex justify-center ${className}`}>
      <div className="inline-flex items-center p-1.5 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl w-[600px]">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            className={`flex-1 py-4 text-lg !rounded-button cursor-pointer whitespace-nowrap transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium shadow-lg shadow-indigo-200'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.icon && <i className={`${tab.icon} mr-2`}></i>}
            {tab.label}
          </Button>
        ))}
      </div>
    </div>
  );
} 