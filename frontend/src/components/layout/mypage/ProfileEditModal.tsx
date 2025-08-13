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
import { getSafeProfileUrl } from '@/utils/defaultImages';

// ⬇️ 새로 추가: 이미지 압축 훅
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
const ALLOWED_CHAR_RE = /[가-힣a-zA-Z0-9]/;
const hasDisallowed = (s: string) => /[^가-힣a-zA-Z0-9]/.test(s);
const countAllowed = (s: string) =>
  Array.from(s).reduce((n, ch) => n + (ALLOWED_CHAR_RE.test(ch) ? 1 : 0), 0);

const DUP_API = 'https://i13a509.p.ssafy.io/api/v1/member/duplicate?nickname=';

/** -----------------------------
 *  URL 유틸 & 검증 (화이트리스트)
 *  ----------------------------- */
// 프로토콜 자동 보정
const normalizeUrl = (raw: string) => {
  const v = (raw ?? '').trim();
  if (!v) return '';
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
};

// 블로그 허용 도메인: 네이버( blog.naver.com ), 티스토리( *.tistory.com ), 벨로그( velog.io )
const isAllowedBlogHost = (hostname: string) => {
  const h = hostname.toLowerCase();

  if (h === 'blog.naver.com') return true;
  if (h === 'tistory.com' || h.endsWith('.tistory.com')) return true;
  if (h === 'velog.io') return true;

  return false;
};

const validateBlogUrl = (raw: string) => {
  const normalized = normalizeUrl(raw);
  if (!normalized) return { ok: true, value: '' }; // 빈 값 허용
  try {
    const u = new URL(normalized);
    if (!/^https?:$/.test(u.protocol)) {
      return { ok: false, msg: 'http(s) 주소만 입력할 수 있어요.' };
    }
    if (!isAllowedBlogHost(u.hostname)) {
      return {
        ok: false,
        msg: '티스토리(tistory.com), 벨로그(velog.io), 네이버 블로그(blog.naver.com) 링크만 허용됩니다.',
      };
    }
    return { ok: true, value: u.toString() };
  } catch {
    return { ok: false, msg: '올바른 URL 형식을 입력해주세요.' };
  }
};

// GitHub만 허용
const validateGithubUrl = (raw: string) => {
  const normalized = normalizeUrl(raw);
  if (!normalized) return { ok: true, value: '' };
  try {
    const u = new URL(normalized);
    const host = u.hostname.toLowerCase();
    const isGithubCom = host === 'github.com';
    const isGithubIo = host.endsWith('.github.io');

    if (!isGithubCom && !isGithubIo) {
      return { ok: false, msg: 'GitHub 주소만 등록할 수 있어요 (github.com 또는 *.github.io).' };
    }
    if (isGithubCom && (!u.pathname || u.pathname === '/')) {
      return { ok: false, msg: 'github.com/사용자명 혹은 저장소 주소를 입력해주세요.' };
    }
    return { ok: true, value: u.toString() };
  } catch {
    return { ok: false, msg: '올바른 URL 형식을 입력해주세요.' };
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
  const {
    selectedImage,
    imagePreview,
    isImageProcessing,
    existingImageUrl,
    handleImageUpload,
    setImagePreview,
    setExistingImageUrl,
  } = useImageCompression();

  const defaultProfileUrl = getSafeProfileUrl(null);
  const [forceDefaultImage, setForceDefaultImage] = useState(false);

  const [nickname, setNickname] = useState(initialNickname);
  const [nicknameError, setNicknameError] = useState<string | null>(null);

  const [blogUrl, setBlogUrl] = useState(initialBlogUrl);
  const [blogError, setBlogError] = useState<string>('');

  const [githubUrl, setGithubUrl] = useState(initialGithubUrl || '');
  const [githubError, setGithubError] = useState<string>('');

  const blogInvalid = blogUrl.trim() !== '' && !validateBlogUrl(blogUrl).ok;
  const githubInvalid = githubUrl.trim() !== '' && !validateGithubUrl(githubUrl).ok;

  const [isCheckingDup, setIsCheckingDup] = useState(false);
  const [isDuplicated, setIsDuplicated] = useState(false);
  const dupAbortRef = React.useRef<AbortController | null>(null);
  const dupTimerRef = React.useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setExistingImageUrl(initialProfileImageUrl || '');
      setForceDefaultImage(false);
    }
  }, [isOpen, initialProfileImageUrl, setExistingImageUrl]);

  useEffect(() => {
    setNickname(initialNickname);
    setNicknameError(null);
    setBlogUrl(initialBlogUrl);
    setGithubUrl(initialGithubUrl || '');
    setBlogError('');
    setGithubError('');
    setIsDuplicated(false);
    setIsCheckingDup(false);
    setForceDefaultImage(false);
  }, [isOpen, initialNickname, initialBlogUrl, initialGithubUrl]);

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

  const [saving, setSaving] = useState(false);
  const handleSubmit = async () => {
    if (saving) return;

    const cleanNickname = (nickname ?? '').trim();
    if (!isValidNickname(cleanNickname)) {
      setNicknameError('닉네임은 2~8자의 완성형 한글/영문/숫자만 가능합니다.');
      return;
    }
    if (isCheckingDup) return;
    if (isDuplicated && cleanNickname !== (initialNickname ?? '')) {
      setNicknameError('이미 사용 중인 닉네임입니다.');
      return;
    }

    const blogCheck = validateBlogUrl(blogUrl);
    const githubCheck = validateGithubUrl(githubUrl);
    if (!blogCheck.ok) setBlogError(blogCheck.msg!);
    if (!githubCheck.ok) setGithubError(githubCheck.msg!);
    if (!blogCheck.ok || !githubCheck.ok) return;

    let profileArg: string | null | undefined = undefined;
    if (selectedImage) {
      profileArg = undefined;
    } else if (forceDefaultImage) {
      profileArg = defaultProfileUrl; // 기본 이미지로 변경
    } else if (!imagePreview && !existingImageUrl && !selectedImage) {
      profileArg = null; // 완전 삭제
    } else {
      profileArg = undefined; // 유지
    }

    setSaving(true);
    try {
      await onSave(
        cleanNickname,
        blogCheck.value || '',
        githubCheck.value || '',
        profileArg,
        selectedImage ?? null
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
      <DialogOverlay className="fixed inset-0 bg-black/70 backdrop-blur-none z-40" />
      <DialogContent className="w-[512px] bg-white z-50 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">프로필 수정</DialogTitle>
        </DialogHeader>

        {/* 프로필 이미지 + 업로드 */}
        <div className="flex flex-col items-center justify-center mt-4 mb-2">
          <div className="relative w-24 h-24 rounded-full border border-gray-300 overflow-hidden flex items-center justify-center">
            {imagePreview ? (
              <img
                src={getSafeProfileUrl(imagePreview)}
                alt="Profile"
                className="w-24 h-24 object-cover"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                No Image
              </div>
            )}

            <label
              htmlFor="image-upload"
              className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition cursor-pointer"
              title="Change profile image"
            >
              <Camera className="w-6 h-6 text-white" />
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/jpeg,image/png,image/gif"
              className="hidden"
              onChange={(e) => {
                setForceDefaultImage(false);
                handleImageUpload(e);
              }}
              disabled={isImageProcessing}
            />
          </div>

          <p className="text-sm text-gray-500 mt-2">
            이미지는 10MB 이하, 정해진 비율에 맞는 이미지만 업로드 가능해요.
          </p>

          {(imagePreview || selectedImage || existingImageUrl) && (
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                className="text-xs text-red-600 underline"
                onClick={() => {
                  setForceDefaultImage(true);
                  setImagePreview('');
                  setExistingImageUrl('');
                  const input = document.getElementById('image-upload') as HTMLInputElement | null;
                  if (input) input.value = '';
                }}
                disabled={isImageProcessing}
              >
                이미지 제거 (기본 이미지 사용)
              </button>
            </div>
          )}
        </div>

        {/* 블로그 URL */}
        <Input
          value={blogUrl}
          onChange={onBlogChange}
          onBlur={onBlogBlur}
          placeholder="네이버, 티스토리, 벨로그만 가능"
        />
        {blogError && <p className="text-xs text-red-500 mt-1">{blogError}</p>}

        {/* 깃허브 URL */}
        <Input
          value={githubUrl}
          onChange={onGithubChange}
          onBlur={onGithubBlur}
          placeholder="https://github.com/username"
        />
        {githubError && <p className="text-xs text-red-500 mt-1">{githubError}</p>}

        <div className="pt-6">
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={
              saving ||
              isImageProcessing ||
              !!nicknameError ||
              !isValidNickname((nickname ?? '').trim()) ||
              isCheckingDup ||
              (isDuplicated && (nickname ?? '').trim() !== (initialNickname ?? '')) ||
              !!blogError ||
              !!githubError ||
              blogInvalid ||
              githubInvalid
            }
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