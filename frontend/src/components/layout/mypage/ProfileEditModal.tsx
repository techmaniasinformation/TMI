import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from '@/components/domain/Dialog';
import { Input } from '@/components/domain/Input';
import { Button } from '@/components/foundation/button';
import { Camera } from 'lucide-react';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialNickname: string;
  initialBlogUrl: string;
  initialGithubUrl?: string;
  initialProfileImageUrl?: string;
  // 추가
  nicknameDisabled?: boolean;
  nicknameHelperText?: string;
  onSave: (
    nickname: string,
    blogUrl: string,
    githubUrl?: string,
    profileImageUrl?: string   // URL만 전달
  ) => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  initialNickname,
  initialBlogUrl,
  initialGithubUrl,
  initialProfileImageUrl,
  nicknameDisabled,     // 추가
  nicknameHelperText,   // 추가
  onSave,
}) => {
  const [nickname, setNickname] = useState(initialNickname);
  const [blogUrl, setBlogUrl] = useState(initialBlogUrl);
  const [githubUrl, setGithubUrl] = useState(initialGithubUrl || '');
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialProfileImageUrl || null);

  // 파일 업로드용
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setNickname(initialNickname);
    setBlogUrl(initialBlogUrl);
    setGithubUrl(initialGithubUrl || '');
    setPreviewUrl(initialProfileImageUrl || null);
    setSelectedFile(null);
  }, [isOpen, initialNickname, initialBlogUrl, initialGithubUrl, initialProfileImageUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : initialProfileImageUrl || null);
  };

  const openFilePicker = () => fileInputRef.current?.click();
  
  const handleSubmit = () => {
    onSave(nickname, blogUrl, githubUrl); // ← 파일/이미지 URL 안 보냄
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* 어두운 배경 (모달 외부만) */}
      <DialogOverlay className="fixed inset-0 bg-black/70 backdrop-blur-none z-40" />

      {/* 하얀색 모달 */}
      <DialogContent className="w-[512px] bg-white z-50 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">프로필 수정</DialogTitle>
        </DialogHeader>

        {/* 프로필 이미지 + 카메라 아이콘 업로드 */}
        <div className="flex flex-col items-center justify-center mt-4 mb-2">
          <div className="w-24 h-24">
            <img
              src={previewUrl || '/default-avatar.png'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border border-gray-300"
              onError={(e) => (e.currentTarget.src = '/default-avatar.png')}
            />
          </div>

          <button
            type="button"
            onClick={openFilePicker}
            className="mt-4 flex items-center justify-center w-10 h-10 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] transition"
            aria-label="Change profile image"
            title="Change profile image"
          >
            <Camera className="w-5 h-5 text-white" />
          </button>

          <p className="text-sm text-gray-500 mt-2">
            Click the camera icon to change profile image
          </p>

          {/* 숨김 파일 인풋 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* 입력 필드 */}
        <div className="space-y-4 mt-2">
          <div>
            <label className="text-sm font-medium text-gray-700">닉네임</label>
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              disabled={!!nicknameDisabled}
            />
            {nicknameHelperText && (
              <p className="mt-1 text-xs text-gray-500">{nicknameHelperText}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">블로그 URL</label>
            <Input value={blogUrl} onChange={(e) => setBlogUrl(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">GitHub URL</label>
            <Input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
          </div>
        </div>

        {/* 버튼 */}
        <div className="pt-6">
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="w-full h-10 text-white font-semibold"
          >
            저장하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditModal;
