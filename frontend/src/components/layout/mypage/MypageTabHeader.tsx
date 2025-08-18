import React from 'react';
import { TabsList, TabsTrigger } from "@/components/domain/Tabs";
import IconTab1 from '@/assets/icons/IconTab1';
import IconTab2 from '@/assets/icons/IconTab2';
import IconTab3 from '@/assets/icons/IconTab3';
import IconTab4 from '@/assets/icons/IconTab4';
import IconTab5 from '@/assets/icons/IconTab5';

export type MyTab = 'profile' | 'comments' | 'posts' | 'follow' | 'starred';

interface MypageTabHeaderProps {
  isCompany: boolean;
  isMyPage: boolean;
  isOtherUser: boolean;
  activeTab: MyTab;
  setActiveTab: React.Dispatch<React.SetStateAction<MyTab>>;
  commentTotalElements: number;
  postTotalElements: number;
  companyPostTotalElements: number;
  companyTotalElements: number;
  userTotalElements: number;
  starTotalElements: number;
  setCurrentCommentPage: React.Dispatch<React.SetStateAction<number>>;
  setCurrentPostPage: React.Dispatch<React.SetStateAction<number>>;
  setCurrentCompanyPage: React.Dispatch<React.SetStateAction<number>>;
  setCurrentUserPage: React.Dispatch<React.SetStateAction<number>>;
  setCurrentStarPage: React.Dispatch<React.SetStateAction<number>>;
}

const MypageTabHeader: React.FC<MypageTabHeaderProps> = ({
  isCompany,
  isMyPage,
  isOtherUser,
  activeTab,
  setActiveTab,
  commentTotalElements,
  postTotalElements,
  companyPostTotalElements,
  companyTotalElements,
  userTotalElements,
  starTotalElements,
  setCurrentCommentPage,
  setCurrentPostPage,
  setCurrentCompanyPage,
  setCurrentUserPage,
  setCurrentStarPage,
}) => {
  const isPersonal = !isCompany;

  return (
    <TabsList className="bg-light-header dark:bg-dark-header rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6 w-full flex flex-wrap justify-start p-0 h-auto">
      {(isMyPage || isOtherUser) && isPersonal && (
        <TabsTrigger 
          value="profile" 
          className="flex items-center px-6 py-4 text-gray-500 dark:text-gray-400 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600"
        >
          <IconTab1 className="w-4 h-4 mr-2 text-inherit" />
          <span className="text-sm">내 정보</span>
        </TabsTrigger>
      )}

      {isMyPage && isPersonal && (
        <TabsTrigger
          value="comments"
          className="flex items-center px-6 py-4 text-gray-500 dark:text-gray-400 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600"
          onClick={() => setCurrentCommentPage(1)}
        >
          <IconTab2 className="w-4 h-4 mr-2 text-inherit" />
          <span className="text-sm">작성한 댓글 ({commentTotalElements})</span>
        </TabsTrigger>
      )}

      <TabsTrigger
        value="posts"
        className="flex items-center px-6 py-4 text-gray-500 dark:text-gray-400 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600"
        onClick={() => setCurrentPostPage(1)}
      >
        <IconTab3 className="w-4 h-4 mr-2 text-inherit" />
        <span className="text-sm">
          작성한 게시글 ({isCompany ? companyPostTotalElements : postTotalElements})
        </span>
      </TabsTrigger>

      {isMyPage && isPersonal && (
        <>
          <TabsTrigger
            value="follow"
            className="flex items-center px-6 py-4 text-gray-500 dark:text-gray-400 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600"
            onClick={() => {
              setCurrentCompanyPage(1);
              setCurrentUserPage(1);
            }}
          >
            <IconTab4 className="w-4 h-4 mr-2 text-inherit" />
            <span className="text-sm">팔로우 ({companyTotalElements + userTotalElements})</span>
          </TabsTrigger>
          <TabsTrigger
            value="starred"
            className="flex items-center px-6 py-4 text-gray-500 dark:text-gray-400 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600"
            onClick={() => setCurrentStarPage(1)}
          >
            <IconTab5 className="w-4 h-4 mr-2 text-inherit" />
            <span className="text-sm">스타 게시글 ({starTotalElements})</span>
          </TabsTrigger>
        </>
      )}
    </TabsList>
  );
};

export default MypageTabHeader;
