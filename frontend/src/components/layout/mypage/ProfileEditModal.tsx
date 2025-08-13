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
import { getSafeProfileUrl } from '@/utils/defaultImages';
import { useThemeStore } from '@/stores/themeStore';
import { useImageCompression } from '@/hooks/useImageCompression';

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
    profileImageUrl?: string | null,
    file?: File | null
  ) => Promise<void>;
}

const NICKNAME_RE = /^[가-힣a-zA-Z0-9]{2,8}$/;
const isValidNickname = (v: string) => NICKNAME_RE.test(v);

// 블로그 허용 도메인
const ALLOWED_BLOG_HOSTS = [
  'tistory.com',
  'velog.io',
  'blog.naver.com',
];

const isAllowedBlogHost = (hostname: string) =>
  ALLOWED_BLOG_HOSTS.some((host) => hostname === host || hostname.endsWith('.' + host));

const validateBlogUrl = (raw: string) => {
  const v = (raw ?? '').trim();
  if (!v) return { ok: true, value: '' };
  try {
    const u = new URL(v.startsWith('http') ? v : 'https://' + v);
    if (!isAllowedBlogHost(u.hostname)) {
      return {
        ok: false,
        msg: '티스토리, 벨로그, 네이버 블로그만 허용됩니다.',
      };
    }
    return { ok: true, value: u.toString() };
  } catch {
    return { ok: false, msg: '올바른 URL 형식이 아닙니다.' };
  }
};

// GitHub 검증
const validateGithubUrl = (raw: string) => {
  const v = (raw ?? '').trim();
  if (!v) return { ok: true, value: '' };
  try {
    const u = new URL(v.startsWith('http') ? v : 'https://' + v);
    const host = u.hostname;
    const isGithubCom = host === 'github.com';
    const isGithubIo = host.endsWith('.github.io');

    if (!isGithubCom && !isGithubIo) {
      return { ok: false, msg: 'GitHub 주소만 등록할 수 있어요.' };
    }
    if (isGithubCom && (!u.pathname || u.pathname === '/')) {
      return { ok: false, msg: 'github.com/사용자명 또는 저장소 주소를 입력해주세요.' };
    }
    return { ok: true, value: u.toString() };
  } catch {
    return { ok: false, msg: '올바른 URL 형식이 아닙니다.' };
  }
};

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
  const { isDarkMode } = useThemeStore();
  const {
    selectedImage,
    imagePreview,
    existingImageUrl,
    handleImageUpload,
    setImagePreview,
    setExistingImageUrl,
    setSelectedImage,
  } = useImageCompression();

  const [nickname, setNickname] = useState(initialNickname);
  const [nicknameError, setNicknameError] = useState<string | null>(null);

  const [blogUrl, setBlogUrl] = useState(initialBlogUrl || '');
  const [blogError, setBlogError] = useState('');
  const [githubUrl, setGithubUrl] = useState(initialGithubUrl || '');
  const [githubError, setGithubError] = useState('');

  const [saving, setSaving] = useState(false);

  // 닉네임 중복 확인 상태
  const [isChecking, setIsChecking] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // ✅ 모달 열릴 때마다 최신 props 값으로 초기화
  useEffect(() => {
    if (isOpen) {
      setNickname(initialNickname);
      setBlogUrl(initialBlogUrl || '');
      setGithubUrl(initialGithubUrl || '');
      setImagePreview('');
      setExistingImageUrl(initialProfileImageUrl || '');
      setSelectedImage(null);
      setNicknameError(null);
      setBlogError('');
      setGithubError('');
      setIsDuplicate(false);
    }
  }, [
    isOpen,
    initialNickname,
    initialBlogUrl,
    initialGithubUrl,
    initialProfileImageUrl,
    setImagePreview,
    setExistingImageUrl,
    setSelectedImage,
  ]);

  // 닉네임 변경
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setNickname(next);
    if (!isValidNickname(next)) {
      setNicknameError('닉네임은 2~8자의 완성형 한글/영문/숫자만 가능합니다.');
    } else {
      setNicknameError(null);
    }
  };

  const handleNicknameBlur = () => {
    const v = (nickname ?? '').trim();
    setNickname(v);
    if (!isValidNickname(v)) {
      setNicknameError('닉네임은 2~8자의 완성형 한글/영문/숫자만 가능합니다.');
    }
  };

  // 닉네임 중복 확인 API 호출 (디바운스)
  useEffect(() => {
    if (!nickname || nickname === initialNickname || nicknameError) {
      setIsDuplicate(false);
      setIsChecking(false);
      return;
    }

    const timer = setTimeout(async () => {
      if (!isValidNickname(nickname)) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        setIsChecking(true);
        const res = await fetch(
          `https://i13a509.p.ssafy.io/api/v1/member/duplicate?nickname=${encodeURIComponent(
            nickname
          )}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        setIsDuplicate(data.data.isDuplicated);
      } catch (err) {
        if ((err as any).name !== 'AbortError') {
          console.error(err);
        }
      } finally {
        setIsChecking(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [nickname, nicknameError, initialNickname]);

  // 블로그/GitHub URL
  const onBlogChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBlogUrl(e.target.value);
    if (blogError) setBlogError('');
  };
  const onGithubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGithubUrl(e.target.value);
    if (githubError) setGithubError('');
  };
  const onBlogBlur = () => {
    const r = validateBlogUrl(blogUrl);
    if (!r.ok) setBlogError(r.msg!);
    else {
      setBlogError('');
      setBlogUrl(r.value || '');
    }
  };
  const onGithubBlur = () => {
    const r = validateGithubUrl(githubUrl);
    if (!r.ok) setGithubError(r.msg!);
    else {
      setGithubError('');
      setGithubUrl(r.value || '');
    }
  };

  const handleSubmit = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const isDelete = !imagePreview && !existingImageUrl && !selectedImage;
      await onSave(
        nickname.trim(),
        blogUrl.trim(),
        githubUrl.trim(),
        isDelete ? null : undefined,
        selectedImage ?? null
      );
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black/70 z-40" />
      <DialogContent
        className={`w-[512px] z-50 rounded-lg shadow-lg ${
          isDarkMode ? 'bg-zinc-800 text-white' : 'bg-white'
        }`}
      >
        <DialogHeader>
          <DialogTitle
            className={`text-lg font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            프로필 수정
          </DialogTitle>
        </DialogHeader>

        {/* 프로필 이미지 */}
        <div className="flex flex-col items-center justify-center mt-4 mb-2">
          <div
            className={`relative w-24 h-24 rounded-full border overflow-hidden flex items-center justify-center ${
              isDarkMode ? 'border-gray-600' : 'border-gray-300'
            }`}
          >
            {imagePreview || existingImageUrl ? (
              <img
                src={getSafeProfileUrl(imagePreview || existingImageUrl)}
                alt="Profile"
                className="w-24 h-24 object-cover"
                draggable={false}
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-400'
                }`}
              >
                No Image
              </div>
            )}
            <label
              htmlFor="image-upload"
              className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition cursor-pointer"
            >
              <Camera className="w-6 h-6 text-white" />
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {(imagePreview || selectedImage) && (
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                className={`text-xs underline ${
                  isDarkMode ? 'text-red-400' : 'text-red-600'
                }`}
                onClick={() => {
                  setImagePreview('');
                  setExistingImageUrl('');
                  setSelectedImage(null);
                  const input = document.getElementById(
                    'image-upload'
                  ) as HTMLInputElement | null;
                  if (input) input.value = '';
                }}
              >
                이미지 제거
              </button>
            </div>
          )}
        </div>

        {/* 입력 필드 */}
        <div className="space-y-4 mt-2">
          {/* 닉네임 */}
          <div>
            <label
              className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}
            >
              닉네임
            </label>
            <Input
              value={nickname}
              onChange={handleNicknameChange}
              onBlur={handleNicknameBlur}
              disabled={!!nicknameDisabled}
              placeholder="완성형 한글/영문/숫자 (2~8자)"
              aria-invalid={!!nicknameError}
            />
            {(nicknameHelperText || nicknameError || isChecking || isDuplicate) && (
              <p
                className={`mt-1 text-xs ${
                  nicknameError
                    ? 'text-red-500'
                    : isDuplicate
                    ? 'text-red-500'
                    : 'text-gray-500'
                }`}
              >
                {nicknameError
                  ? nicknameError
                  : isChecking
                  ? '중복 확인 중...'
                  : isDuplicate
                  ? '이미 사용 중인 닉네임입니다.'
                  : nicknameHelperText || '사용 가능한 닉네임입니다.'}
              </p>
            )}
          </div>

          {/* 블로그 URL */}
          <div>
            <label
              className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}
            >
              블로그 URL
            </label>
            <Input
              value={blogUrl}
              onChange={onBlogChange}
              onBlur={onBlogBlur}
              placeholder="blog.naver.com/..., *.tistory.com, velog.io/..."
              aria-invalid={!!blogError}
              inputMode="url"
            />
            {blogError && (
              <p className="mt-1 text-xs text-red-500">{blogError}</p>
            )}
          </div>

          {/* GitHub URL */}
          <div>
            <label
              className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}
            >
              GitHub URL
            </label>
            <Input
              value={githubUrl}
              onChange={onGithubChange}
              onBlur={onGithubBlur}
              placeholder="github.com/사용자명 또는 사용자명.github.io"
              aria-invalid={!!githubError}
              inputMode="url"
            />
            {githubError && (
              <p className="mt-1 text-xs text-red-500">{githubError}</p>
            )}
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="pt-6">
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={
              saving ||
              !!nicknameError ||
              !isValidNickname((nickname ?? '').trim()) ||
              !!blogError ||
              !!githubError ||
              isDuplicate
            }
            className={`w-full h-10 text-white font-semibold ${
              saving ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {saving ? '저장 중…' : '저장하기'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditModal;
