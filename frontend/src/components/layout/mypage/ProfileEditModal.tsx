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
  nicknameDisabled?: boolean;
  nicknameHelperText?: string;
  onSave: (
    nickname: string,
    blogUrl: string,
    githubUrl?: string,
    profileImageUrl?: string,
    file?: File | null 
  ) => Promise<void>;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  initialNickname,
  initialBlogUrl,
  initialGithubUrl,
  initialProfileImageUrl,
  nicknameDisabled,
  nicknameHelperText,
  onSave,
}) => {
  const [nickname, setNickname] = useState(initialNickname);
  const [blogUrl, setBlogUrl] = useState(initialBlogUrl);
  const [githubUrl, setGithubUrl] = useState(initialGithubUrl || '');
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialProfileImageUrl || null);

  // 이미지 상태
  const [imgLoading, setImgLoading] = useState(false);
  const fallbackAppliedRef = useRef(false);

  // 파일 업로드용 (저장에는 사용하지 않음)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // blob URL 정리용
  const prevUrlRef = useRef<string | null>(null);
  useEffect(() => {
    if (
      prevUrlRef.current &&
      prevUrlRef.current !== previewUrl &&
      prevUrlRef.current.startsWith('blob:')
    ) {
      URL.revokeObjectURL(prevUrlRef.current);
    }
    prevUrlRef.current = previewUrl || null;
    return () => {
      if (prevUrlRef.current && prevUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(prevUrlRef.current);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    setNickname(initialNickname);
    setBlogUrl(initialBlogUrl);
    setGithubUrl(initialGithubUrl || '');
    setPreviewUrl(initialProfileImageUrl || null);
    setSelectedFile(null);
    setImgLoading(!!initialProfileImageUrl);
    fallbackAppliedRef.current = false;
  }, [isOpen, initialNickname, initialBlogUrl, initialGithubUrl, initialProfileImageUrl]);

  // 기본 이미지로 1회만 안전하게 대체 (무한 onError 방지)
  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (fallbackAppliedRef.current) return;
    fallbackAppliedRef.current = true;
    setImgLoading(false);
    (e.currentTarget as HTMLImageElement).src = '/default-avatar.png';
  };

  const handleImgLoad = () => {
    setImgLoading(false);
    fallbackAppliedRef.current = false;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const MAX = 5 * 1024 * 1024; // 5MB
      const okType = /^image\//.test(file.type);
      if (!okType) {
        alert('이미지 파일만 업로드 가능합니다.');
        e.target.value = '';
        return;
      }
      if (file.size > MAX) {
        alert('이미지는 5MB 이하만 업로드 가능합니다.');
        e.target.value = '';
        return;
      }
    }
    setSelectedFile(file);
    fallbackAppliedRef.current = false;
    if (file) {
      setImgLoading(true);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setImgLoading(!!initialProfileImageUrl);
      setPreviewUrl(initialProfileImageUrl || null);
    }
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const [saving, setSaving] = useState(false);
  const handleSubmit = async () => {
    if (saving) return;
    setSaving(true);
    try {
      // 파일 없음 + 프리뷰가 초기 이미지와 같으면 URL은 보내지 않음(= undefined)
      const isSameAsInitial =
        !selectedFile &&
        (previewUrl ?? '') === (initialProfileImageUrl ?? '');

      // 아무 것도 안 바뀐 경우 요청 자체를 생략
      const nothingChanged =
        (nickname ?? '') === (initialNickname ?? '') &&
        (blogUrl ?? '') === (initialBlogUrl ?? '') &&
        (githubUrl ?? '') === (initialGithubUrl ?? '') &&
        !selectedFile &&
        (isSameAsInitial || (previewUrl ?? '') === (initialProfileImageUrl ?? ''));

      if (nothingChanged) {
        onClose();
        return;
      }

      await onSave(
        nickname,
        blogUrl,
        githubUrl,
        isSameAsInitial ? undefined : (previewUrl ?? undefined),
        selectedFile
      );
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
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
          <div className="w-24 h-24 rounded-full border border-gray-300 overflow-hidden flex items-center justify-center">
            {previewUrl ? (
              <>
                {imgLoading && <div className="w-full h-full animate-pulse bg-gray-100" />}
                <img
                  key={previewUrl}
                  src={previewUrl}
                  alt="Profile"
                  className={`w-24 h-24 object-contain ${imgLoading ? 'hidden' : 'block'}`}
                  onLoad={handleImgLoad}
                  onError={handleImgError}
                  draggable={false}
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                No Image
              </div>
            )}
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
          {(previewUrl || selectedFile) && (
            <button
              type="button"
              onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
              className="mt-2 text-xs text-gray-500 underline"
            >
              이미지 제거
            </button>
          )}
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
            disabled={saving}
            className={`w-full h-10 text-white font-semibold ${saving ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {saving ? '저장 중…' : '저장하기'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditModal;
