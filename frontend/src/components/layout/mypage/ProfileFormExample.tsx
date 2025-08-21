import React, { useState } from 'react';
import { ProfileForm, ProfileImageSection, ProfileFormFields } from './ProfileForm';

// ===== 새로운 통합 ProfileForm 사용 예시 =====
export function ProfileFormExample() {
  const [formData, setFormData] = useState({
    nickname: '',
    blogUrl: '',
    githubUrl: '',
    imagePreview: '',
  });

  const [errors, setErrors] = useState({
    nickname: null as string | null,
    blogUrl: '',
    githubUrl: '',
  });

  const [imagePreview, setImagePreview] = useState('');

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, nickname: e.target.value }));
  };

  const handleBlogChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, blogUrl: e.target.value }));
  };

  const handleGithubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, githubUrl: e.target.value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImagePreview('');
  };

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-4">ProfileForm 컴포넌트 통합 예시</h2>
      
      {/* 1. 통합 ProfileForm 컴포넌트 사용 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">1. 통합 ProfileForm 컴포넌트</h3>
        <div className="border rounded p-6">
          <h4 className="font-semibold mb-4">Vertical 레이아웃 (기본)</h4>
          <ProfileForm
            imagePreview={imagePreview}
            existingImageUrl=""
            handleImageUpload={handleImageUpload}
            handleImageRemove={handleImageRemove}
            nickname={formData.nickname}
            nicknameError={errors.nickname}
            blogUrl={formData.blogUrl}
            blogError={errors.blogUrl}
            githubUrl={formData.githubUrl}
            githubError={errors.githubUrl}
            handleNicknameChange={handleNicknameChange}
            handleNicknameBlur={() => {}}
            onBlogChange={handleBlogChange}
            onGithubChange={handleGithubChange}
            onBlogBlur={() => {}}
            onGithubBlur={() => {}}
            layout="vertical"
          />
        </div>
      </div>

      {/* 2. Horizontal 레이아웃 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">2. Horizontal 레이아웃</h3>
        <div className="border rounded p-6">
          <h4 className="font-semibold mb-4">이미지와 폼 필드를 나란히 배치</h4>
          <ProfileForm
            imagePreview={imagePreview}
            existingImageUrl=""
            handleImageUpload={handleImageUpload}
            handleImageRemove={handleImageRemove}
            nickname={formData.nickname}
            nicknameError={errors.nickname}
            blogUrl={formData.blogUrl}
            blogError={errors.blogUrl}
            githubUrl={formData.githubUrl}
            githubError={errors.githubUrl}
            handleNicknameChange={handleNicknameChange}
            handleNicknameBlur={() => {}}
            onBlogChange={handleBlogChange}
            onGithubChange={handleGithubChange}
            onBlogBlur={() => {}}
            onGithubBlur={() => {}}
            layout="horizontal"
          />
        </div>
      </div>

      {/* 3. 이미지 섹션만 사용 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">3. 이미지 섹션만 사용</h3>
        <div className="border rounded p-6">
          <h4 className="font-semibold mb-4">ProfileImageSection (기존 API 호환성)</h4>
          <ProfileImageSection
            imagePreview={imagePreview}
            existingImageUrl=""
            handleImageUpload={handleImageUpload}
            handleImageRemove={handleImageRemove}
          />
        </div>
      </div>

      {/* 4. 폼 필드만 사용 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">4. 폼 필드만 사용</h3>
        <div className="border rounded p-6">
          <h4 className="font-semibold mb-4">ProfileFormFields (기존 API 호환성)</h4>
          <ProfileFormFields
            nickname={formData.nickname}
            nicknameError={errors.nickname}
            blogUrl={formData.blogUrl}
            blogError={errors.blogUrl}
            githubUrl={formData.githubUrl}
            githubError={errors.githubUrl}
            isCheckingDup={false}
            isDuplicated={false}
            handleNicknameChange={handleNicknameChange}
            handleNicknameBlur={() => {}}
            onBlogChange={handleBlogChange}
            onGithubChange={handleGithubChange}
            onBlogBlur={() => {}}
            onGithubBlur={() => {}}
          />
        </div>
      </div>

      {/* 5. 조건부 렌더링 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">5. 조건부 렌더링</h3>
        <div className="border rounded p-6">
          <h4 className="font-semibold mb-4">이미지 섹션 숨김</h4>
          <ProfileForm
            nickname={formData.nickname}
            nicknameError={errors.nickname}
            blogUrl={formData.blogUrl}
            blogError={errors.blogUrl}
            githubUrl={formData.githubUrl}
            githubError={errors.githubUrl}
            handleNicknameChange={handleNicknameChange}
            handleNicknameBlur={() => {}}
            onBlogChange={handleBlogChange}
            onGithubChange={handleGithubChange}
            onBlogBlur={() => {}}
            onGithubBlur={() => {}}
            showImageSection={false}
          />
        </div>
      </div>

      {/* 6. 에러 상태 시뮬레이션 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">6. 에러 상태 시뮬레이션</h3>
        <div className="border rounded p-6">
          <h4 className="font-semibold mb-4">에러가 있는 상태</h4>
          <ProfileForm
            imagePreview={imagePreview}
            existingImageUrl=""
            handleImageUpload={handleImageUpload}
            handleImageRemove={handleImageRemove}
            nickname=""
            nicknameError="닉네임은 2자 이상이어야 합니다."
            blogUrl="invalid-url"
            blogError="올바른 블로그 URL을 입력해주세요."
            githubUrl="invalid-github"
            githubError="올바른 GitHub URL을 입력해주세요."
            handleNicknameChange={handleNicknameChange}
            handleNicknameBlur={() => {}}
            onBlogChange={handleBlogChange}
            onGithubChange={handleGithubChange}
            onBlogBlur={() => {}}
            onGithubBlur={() => {}}
            isCheckingDup={false}
            isDuplicated={true}
          />
        </div>
      </div>

      {/* 7. 중복 확인 상태 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">7. 중복 확인 상태</h3>
        <div className="border rounded p-6">
          <h4 className="font-semibold mb-4">중복 확인 중...</h4>
          <ProfileForm
            nickname="testuser"
            nicknameError={null}
            blogUrl=""
            blogError=""
            githubUrl=""
            githubError=""
            handleNicknameChange={handleNicknameChange}
            handleNicknameBlur={() => {}}
            onBlogChange={handleBlogChange}
            onGithubChange={handleGithubChange}
            onBlogBlur={() => {}}
            onGithubBlur={() => {}}
            isCheckingDup={true}
            isDuplicated={false}
            showImageSection={false}
          />
        </div>
      </div>
    </div>
  );
}
