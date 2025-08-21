import React from 'react';
import { ProfileCard, UserProfileCard, CompanyProfileCard, ProfileCardGrid } from './ProfileCard';

// ===== 새로운 통합 ProfileCard 사용 예시 =====
export function ProfileCardExample() {
  // 샘플 데이터
  const sampleUser = {
    memberId: 1,
    nickname: '사용자1',
    memberProfileUrl: 'https://example.com/user1.jpg',
  };

  const sampleCompany = {
    companyId: 1,
    companyName: '기업1',
    companyProfileUrl: 'https://example.com/company1.jpg',
  };

  const sampleProfiles = [
    {
      id: 1,
      name: '사용자1',
      profileUrl: 'https://example.com/user1.jpg',
      type: 'user' as const,
    },
    {
      id: 2,
      name: '사용자2',
      profileUrl: 'https://example.com/user2.jpg',
      type: 'user' as const,
    },
    {
      id: 3,
      name: '기업1',
      profileUrl: 'https://example.com/company1.jpg',
      type: 'company' as const,
    },
    {
      id: 4,
      name: '기업2',
      profileUrl: 'https://example.com/company2.jpg',
      type: 'company' as const,
    },
  ];

  const handleProfileClick = (type: 'user' | 'company', id: number) => {
    console.log(`${type} 프로필 클릭: ${id}`);
  };

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-4">ProfileCard 컴포넌트 통합 예시</h2>
      
      {/* 1. 통합 ProfileCard 컴포넌트 사용 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">1. 통합 ProfileCard 컴포넌트</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <h4 className="font-semibold mb-2">사용자 카드</h4>
            <ProfileCard
              type="user"
              user={sampleUser}
              onClick={() => handleProfileClick('user', sampleUser.memberId)}
              size="md"
            />
          </div>
          <div className="border rounded p-4">
            <h4 className="font-semibold mb-2">기업 카드</h4>
            <ProfileCard
              type="company"
              company={sampleCompany}
              onClick={() => handleProfileClick('company', sampleCompany.companyId)}
              size="md"
            />
          </div>
        </div>
      </div>

      {/* 2. 통합 데이터 사용 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">2. 통합 데이터 사용</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <h4 className="font-semibold mb-2">사용자 (통합 데이터)</h4>
            <ProfileCard
              type="user"
              data={{
                id: 1,
                name: '사용자1',
                profileUrl: 'https://example.com/user1.jpg',
              }}
              onClick={() => handleProfileClick('user', 1)}
              size="md"
            />
          </div>
          <div className="border rounded p-4">
            <h4 className="font-semibold mb-2">기업 (통합 데이터)</h4>
            <ProfileCard
              type="company"
              data={{
                id: 1,
                name: '기업1',
                profileUrl: 'https://example.com/company1.jpg',
              }}
              onClick={() => handleProfileClick('company', 1)}
              size="md"
            />
          </div>
        </div>
      </div>

      {/* 3. 다양한 크기 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">3. 다양한 크기</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded p-4 text-center">
            <h4 className="font-semibold mb-2">Small</h4>
            <ProfileCard
              type="user"
              data={{
                id: 1,
                name: '사용자1',
                profileUrl: 'https://example.com/user1.jpg',
              }}
              size="sm"
            />
          </div>
          <div className="border rounded p-4 text-center">
            <h4 className="font-semibold mb-2">Medium</h4>
            <ProfileCard
              type="user"
              data={{
                id: 1,
                name: '사용자1',
                profileUrl: 'https://example.com/user1.jpg',
              }}
              size="md"
            />
          </div>
          <div className="border rounded p-4 text-center">
            <h4 className="font-semibold mb-2">Large</h4>
            <ProfileCard
              type="user"
              data={{
                id: 1,
                name: '사용자1',
                profileUrl: 'https://example.com/user1.jpg',
              }}
              size="lg"
            />
          </div>
        </div>
      </div>

      {/* 4. 그리드 모드 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">4. 그리드 모드</h3>
        <div className="border rounded p-4">
          <h4 className="font-semibold mb-2">4열 그리드</h4>
          <ProfileCard
            profiles={sampleProfiles}
            onProfileClick={handleProfileClick}
            columns={4}
            size="md"
          />
        </div>
      </div>

      {/* 5. 개별 컴포넌트 사용 (기존 API 호환성) */}
      <div>
        <h3 className="text-lg font-semibold mb-4">5. 개별 컴포넌트 사용 (기존 API 호환성)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <h4 className="font-semibold mb-2">UserProfileCard</h4>
            <UserProfileCard
              user={sampleUser}
              onClick={() => handleProfileClick('user', sampleUser.memberId)}
              size="md"
            />
          </div>
          <div className="border rounded p-4">
            <h4 className="font-semibold mb-2">CompanyProfileCard</h4>
            <CompanyProfileCard
              company={sampleCompany}
              onClick={() => handleProfileClick('company', sampleCompany.companyId)}
              size="md"
            />
          </div>
        </div>
      </div>

      {/* 6. ProfileCardGrid 사용 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">6. ProfileCardGrid 사용</h3>
        <div className="border rounded p-4">
          <h4 className="font-semibold mb-2">별도 ProfileCardGrid 컴포넌트</h4>
          <ProfileCardGrid
            profiles={sampleProfiles}
            onProfileClick={handleProfileClick}
            columns={4}
            size="md"
          />
        </div>
      </div>

      {/* 7. 타입 표시 옵션 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">7. 타입 표시 옵션</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <h4 className="font-semibold mb-2">타입 표시 (기본)</h4>
            <ProfileCard
              type="user"
              data={{
                id: 1,
                name: '사용자1',
                profileUrl: 'https://example.com/user1.jpg',
              }}
              showType={true}
              size="md"
            />
          </div>
          <div className="border rounded p-4">
            <h4 className="font-semibold mb-2">타입 숨김</h4>
            <ProfileCard
              type="user"
              data={{
                id: 1,
                name: '사용자1',
                profileUrl: 'https://example.com/user1.jpg',
              }}
              showType={false}
              size="md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
