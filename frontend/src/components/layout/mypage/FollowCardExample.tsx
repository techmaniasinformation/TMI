import React from 'react';
import { FollowCard, FollowUserCard, FollowCompanyCard } from './FollowCard';

// ===== 새로운 통합 FollowCard 사용 예시 =====
export function FollowCardExample() {
  const handleCardClick = (type: 'user' | 'company', id: string | number) => {
    console.log(`${type} 카드 클릭: ${id}`);
  };

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-4">FollowCard 컴포넌트 통합 예시</h2>
      
      {/* 1. 통합 FollowCard 컴포넌트 사용 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">1. 통합 FollowCard 컴포넌트</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <h4 className="font-semibold mb-2">사용자 카드</h4>
            <FollowCard
              type="user"
              id={1}
              name="사용자1"
              image="https://example.com/user1.jpg"
              badgeName="프론트엔드 개발자"
              onClick={() => handleCardClick('user', 1)}
            />
          </div>
          <div className="border rounded p-4">
            <h4 className="font-semibold mb-2">기업 카드</h4>
            <FollowCard
              type="company"
              id="company1"
              name="기업1"
              image="https://example.com/company1.jpg"
              onClick={() => handleCardClick('company', 'company1')}
            />
          </div>
        </div>
      </div>

      {/* 2. 다양한 크기 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">2. 다양한 크기</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded p-4">
            <h4 className="font-semibold mb-2">Small</h4>
            <FollowCard
              type="user"
              id={1}
              name="사용자1"
              image="https://example.com/user1.jpg"
              badgeName="개발자"
              size="sm"
            />
          </div>
          <div className="border rounded p-4">
            <h4 className="font-semibold mb-2">Medium (기본)</h4>
            <FollowCard
              type="user"
              id={1}
              name="사용자1"
              image="https://example.com/user1.jpg"
              badgeName="개발자"
              size="md"
            />
          </div>
          <div className="border rounded p-4">
            <h4 className="font-semibold mb-2">Large</h4>
            <FollowCard
              type="user"
              id={1}
              name="사용자1"
              image="https://example.com/user1.jpg"
              badgeName="개발자"
              size="lg"
            />
          </div>
        </div>
      </div>

      {/* 3. 배지 표시 옵션 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">3. 배지 표시 옵션</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <h4 className="font-semibold mb-2">배지 표시 (기본)</h4>
            <FollowCard
              type="user"
              id={1}
              name="사용자1"
              image="https://example.com/user1.jpg"
              badgeName="프론트엔드 개발자"
              showBadge={true}
            />
          </div>
          <div className="border rounded p-4">
            <h4 className="font-semibold mb-2">배지 숨김</h4>
            <FollowCard
              type="user"
              id={1}
              name="사용자1"
              image="https://example.com/user1.jpg"
              badgeName="프론트엔드 개발자"
              showBadge={false}
            />
          </div>
        </div>
      </div>

      {/* 4. 개별 컴포넌트 사용 (기존 API 호환성) */}
      <div>
        <h3 className="text-lg font-semibold mb-4">4. 개별 컴포넌트 사용 (기존 API 호환성)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <h4 className="font-semibold mb-2">FollowUserCard</h4>
            <FollowUserCard
              id={1}
              nickname="사용자1"
              image="https://example.com/user1.jpg"
              badgeName="프론트엔드 개발자"
              onClick={() => handleCardClick('user', 1)}
            />
          </div>
          <div className="border rounded p-4">
            <h4 className="font-semibold mb-2">FollowCompanyCard</h4>
            <FollowCompanyCard
              id="company1"
              name="기업1"
              image="https://example.com/company1.jpg"
              onClick={() => handleCardClick('company', 'company1')}
            />
          </div>
        </div>
      </div>

      {/* 5. 이미지가 없는 경우 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">5. 이미지가 없는 경우</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <h4 className="font-semibold mb-2">사용자 (이미지 없음)</h4>
            <FollowCard
              type="user"
              id={1}
              name="사용자1"
              image={null}
              badgeName="개발자"
            />
          </div>
          <div className="border rounded p-4">
            <h4 className="font-semibold mb-2">기업 (이미지 없음)</h4>
            <FollowCard
              type="company"
              id="company1"
              name="기업1"
              image={null}
            />
          </div>
        </div>
      </div>

      {/* 6. 여러 카드 리스트 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">6. 여러 카드 리스트</h3>
        <div className="border rounded p-4">
          <h4 className="font-semibold mb-4">팔로우 목록</h4>
          <div className="space-y-2">
            <FollowCard
              type="user"
              id={1}
              name="프론트엔드 개발자"
              image="https://example.com/user1.jpg"
              badgeName="React 전문가"
              onClick={() => handleCardClick('user', 1)}
            />
            <FollowCard
              type="user"
              id={2}
              name="백엔드 개발자"
              image="https://example.com/user2.jpg"
              badgeName="Node.js 전문가"
              onClick={() => handleCardClick('user', 2)}
            />
            <FollowCard
              type="company"
              id="company1"
              name="테크 스타트업"
              image="https://example.com/company1.jpg"
              onClick={() => handleCardClick('company', 'company1')}
            />
            <FollowCard
              type="company"
              id="company2"
              name="대기업"
              image="https://example.com/company2.jpg"
              onClick={() => handleCardClick('company', 'company2')}
            />
          </div>
        </div>
      </div>

      {/* 7. 커스텀 스타일링 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">7. 커스텀 스타일링</h3>
        <div className="border rounded p-4">
          <h4 className="font-semibold mb-4">커스텀 클래스 적용</h4>
          <FollowCard
            type="user"
            id={1}
            name="VIP 사용자"
            image="https://example.com/user1.jpg"
            badgeName="프리미엄"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-600"
            onClick={() => handleCardClick('user', 1)}
          />
        </div>
      </div>
    </div>
  );
}
