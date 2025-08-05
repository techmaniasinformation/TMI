import React, { useState, useEffect } from 'react';
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
  onSave: (nickname: string, blogUrl: string, githubUrl?: string) => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  initialNickname,
  initialBlogUrl,
  initialGithubUrl,
  onSave,
}) => {
  const [nickname, setNickname] = useState(initialNickname);
  const [blogUrl, setBlogUrl] = useState(initialBlogUrl);
  const [githubUrl, setGithubUrl] = useState(initialGithubUrl || '');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    setNickname(initialNickname);
    setBlogUrl(initialBlogUrl);
    setGithubUrl(initialGithubUrl || '');
    setProfileImage(null);
    setPreviewUrl(null);
  }, [isOpen, initialNickname, initialBlogUrl, initialGithubUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    onSave(nickname, blogUrl, githubUrl);
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

        {/* 프로필 이미지 및 업로드 */}
        <div className="flex flex-col items-center justify-center mt-4 mb-2 relative">
          <div className="relative w-24 h-24">
            <img
              src={previewUrl || '/default-avatar.png'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border border-gray-300"
            />
            <label
              htmlFor="profileImageUpload"
              className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer"
            >
              <Camera className="w-5 h-5 text-purple-600" />
            </label>
            <input
              id="profileImageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Click the camera icon to change profile image
          </p>
        </div>

        {/* 입력 필드 */}
        <div className="space-y-4 mt-2">
          <div>
            <label className="text-sm font-medium text-gray-700">닉네임</label>
            <Input value={nickname} onChange={(e) => setNickname(e.target.value)} />
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
