import React from 'react';
import FilterableCardList from '@/components/domain/FilterableCardList';
import PopularPosts from '@/components/layout/PopularPosts';

interface HomePageProps {}

export default function HomePage({}: HomePageProps) {
  return (
    <div className="flex gap-8">
      <div className="flex-1 max-w-[70%]">
        <FilterableCardList />
      </div>
      <div className="w-[30%]">
        <PopularPosts />
      </div>
    </div>
  );
}