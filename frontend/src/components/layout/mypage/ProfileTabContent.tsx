import React from 'react';
import { TabsContent } from "@/components/domain/Tabs";
import MypageBadgeGrid from './MypageBadgeGrid';
import type { Badge, MemberBadge } from "@/types/mypage/badge";

type SelectedBadge = Badge & {
  memberBadgeId?: number;
  receivedAt?: string | null;
  isRepresentative?: boolean;
};

interface ProfileTabContentProps {
  allBadges: Badge[];
  memberBadges: MemberBadge[];
  canOpenBadgeModal: boolean;
  onBadgeClick: (badge: SelectedBadge) => void;
}

const ProfileTabContent: React.FC<ProfileTabContentProps> = ({
  allBadges,
  memberBadges,
  canOpenBadgeModal,
  onBadgeClick,
}) => {
  return (
    <TabsContent value="profile" className="p-6 bg-light-header dark:bg-dark-header border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">업적</h2>
      <MypageBadgeGrid
        allBadges={allBadges}
        memberBadges={memberBadges}
        canOpenBadgeModal={canOpenBadgeModal}
        onBadgeClick={onBadgeClick}
      />
    </TabsContent>
  );
};

export default ProfileTabContent;
