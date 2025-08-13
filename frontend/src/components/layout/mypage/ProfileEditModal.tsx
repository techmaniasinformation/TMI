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
import { useThemeStore } from '@/stores/themeStore'; // Import useThemeStore

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

// 블로그 허용 도메인: 네이버( blog.naver.com ), 티스토리( *.tistory.com ), 벨로그( velog.io ), Medium( medium.com )
const isAllowedBlogHost = (hostname: string) => {
  const h = hostname.toLowerCase();

  // 네이버 블로그는 blog.naver.com 만 허용
  if (h === 'blog.naver.com') return true;

  // 티스토리는 루트/서브도메인 모두 허용
  if (h === 'tistory.com' || h.endsWith('.tistory.com')) return true;

  // 벨로그
  if (h === 'velog.io') return true;

  // Medium
  if (h === 'medium.com') return true;

  return false;
};

const validateBlogUrl = (raw: string) => {
  const normalized = normalizeUrl(raw);
  if (!normalized) return { ok: true, value: '' }; // 빈 값은 허용(선택 입력)
  try {
    const u = new URL(normalized);
    if (!/^https?:$/.test(u.protocol)) {
      return { ok: false, msg: 'http(s) 주소만 입력할 수 있어요.' };
    }
    if (!isAllowedBlogHost(u.hostname)) {
      return {
        ok: false,
        msg: '티스토리(tistory.com), 벨로그(velog.io), 네이버 블로그(blog.naver.com), Medium(medium.com) 링크만 허용됩니다.',
      };
    }
    return { ok: true, value: u.toString() };
  } catch {
    return { ok: false, msg: '올바른 URL 형식을 입력해주세요.' };
  }
};

// GitHub만 허용 (github.com/프로필 또는 저장소, 혹은 *.github.io)
const validateGithubUrl = (raw: string) => {
  const normalized = normalizeUrl(raw);
  if (!normalized) return { ok: true, value: '' }; // 선택 입력
  try {
    const u = new URL(normalized);
    const host = u.hostname.toLowerCase();
    const isGithubCom = host === 'github.com';
    const isGithubIo = host.endsWith('.github.io');

    if (!isGithubCom && !isGithubIo) {
      return { ok: false, msg: 'GitHub 주소만 등록할 수 있어요 (github.com 또는 *.github.io).' };
    }
    // github.com의 경우 최소한 path가 있어야 프로필/레포 형태
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
  const { isDarkMode } = useThemeStore(); // Get isDarkMode state
  // ⬇️ 훅 사용
  const {
    selectedImage,
    imagePreview,
    isImageProcessing,
    existingImageUrl,
    handleImageUpload,
    setImagePreview,
    setExistingImageUrl,
  } = useImageCompression();

  const [nickname, setNickname] = useState(initialNickname);
  const [nicknameError, setNicknameError] = useState<string | null>(null);

  const [blogUrl, setBlogUrl] = useState(initialBlogUrl);
  const [blogError, setBlogError] = useState<string>('');          // ⬅️ 블로그 에러

  const [githubUrl, setGithubUrl] = useState(initialGithubUrl || '');
  const [githubError, setGithubError] = useState<string>('');      // ⬅️ 깃허브 에러

  // 🔽 이 두 줄은 블로그/GitHub 입력 중 실시간으로 유효성 확인
  const blogInvalid = blogUrl.trim() !== '' && !validateBlogUrl(blogUrl).ok;
  const githubInvalid = githubUrl.trim() !== '' && !validateGithubUrl(githubUrl).ok;

  // 닉네임 중복 검사 상태
  const [isCheckingDup, setIsCheckingDup] = useState(false);
  const [isDuplicated, setIsDuplicated] = useState(false);
  const dupAbortRef = React.useRef<AbortController | null>(null);
  const dupTimerRef = React.useRef<number | null>(null);

  // 모달 열릴 때 초기 이미지 URL을 훅에 주입
  useEffect(() => {
    if (isOpen) {
      setExistingImageUrl(initialProfileImageUrl || '');
    }
  }, [isOpen, initialProfileImageUrl, setExistingImageUrl]);

  // 모달 state 초기화
  useEffect(() => {
    setNickname(initialNickname);
    setNicknameError(null);
    setBlogUrl(initialBlogUrl);
    setGithubUrl(initialGithubUrl || '');
    setBlogError('');
    setGithubError('');
    setIsDuplicated(false);
    setIsCheckingDup(false);
  }, [isOpen, initialNickname, initialBlogUrl, initialGithubUrl]);

  // 닉네임 입력/검증
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    const currentAllowed = countAllowed(nickname);
    const nextAllowed = countAllowed(next);
    if (nextAllowed <= currentAllowed || nextAllowed <= 8) setNickname(next);

    const allowedCount = countAllowed(next);
    if (hasDisallowed(next)) {
      setNicknameError('허용 외 문자가 포함되어 있어요 (자모·특수·공백 등).');
    } else if (allowedCount < 2) {
      setNicknameError('닉네임은 2~8자의 완성형 한글/영문/숫자만 가능합니다.');
    } else {
      setNicknameError(null);
    }
  };

  // 닉네임 중복 검사 (디바운스 + abort)
  useEffect(() => {
    const value = (nickname ?? '').trim();

    if (dupTimerRef.current) {
      clearTimeout(dupTimerRef.current);
      dupTimerRef.current = null;
    }
    dupAbortRef.current?.abort();

    if (!nicknameDisabled && isValidNickname(value) && value !== (initialNickname ?? '')) {
      setIsCheckingDup(true);
      setIsDuplicated(false);

      dupTimerRef.current = window.setTimeout(async () => {
        const controller = new AbortController();
        dupAbortRef.current = controller;
        try {
          const res = await fetch(DUP_API + encodeURIComponent(value), {
            method: 'GET',
            signal: controller.signal,
          });
          const json = await res.json().catch(() => null);
          const duplicated = !!json?.data?.isDuplicated;
          setIsDuplicated(duplicated);
          setNicknameError((prev) => {
            if (prev && prev !== '이미 사용 중인 닉네임입니다.') return prev;
            return duplicated ? '이미 사용 중인 닉네임입니다.' : null;
          });
        } catch {
          setNicknameError((prev) => prev ?? null);
        } finally {
          setIsCheckingDup(false);
          dupAbortRef.current = null;
        }
      }, 400);
    } else {
      setIsCheckingDup(false);
      setIsDuplicated(false);
      setNicknameError((prev) => (prev === '이미 사용 중인 닉네임입니다.' ? null : prev));
    }

    return () => {
      if (dupTimerRef.current) {
        clearTimeout(dupTimerRef.current);
        dupTimerRef.current = null;
      }
      dupAbortRef.current?.abort();
    };
  }, [nickname, initialNickname, nicknameDisabled]);

  const handleNicknameBlur = () => {
    const v = (nickname ?? '').trim();
    setNickname(v);
    if (!isValidNickname(v)) setNicknameError('닉네임은 2~8자의 완성형 한글/영문/숫자만 가능합니다.');
    else if (isDuplicated) setNicknameError('이미 사용 중인 닉네임입니다.');
    else setNicknameError(null);
  };

  // 블로그/깃허브 입력 시 에러 초기화 + 블러에서 검증/정규화
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

  // 저장
  const [saving, setSaving] = useState(false);
  const handleSubmit = async () => {
    if (saving) return;

    // 닉네임 최종 검증
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

    // 블로그/깃허브 최종 검증
    const blogCheck = validateBlogUrl(blogUrl);
    const githubCheck = validateGithubUrl(githubUrl);

    if (!blogCheck.ok) setBlogError(blogCheck.msg!);
    if (!githubCheck.ok) setGithubError(githubCheck.msg!);
    if (!blogCheck.ok || !githubCheck.ok) return;

    setSaving(true);
    try {
      // 삭제 의도: 미리보기/기존URL/선택파일 모두 없음 → null 전송
      const isDelete = !imagePreview && !existingImageUrl && !selectedImage;

      await onSave(
        cleanNickname,
        blogCheck.value || '',     // 정규화된 블로그 URL
        githubCheck.value || '',   // 정규화된 깃허브 URL
        isDelete ? null : undefined,       // 삭제면 null, 유지면 undefined
        selectedImage ?? null              // 새 이미지가 있으면 파일 전달
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
      <DialogContent className={`w-[512px] z-50 rounded-lg shadow-lg ${isDarkMode ? 'bg-zinc-800 text-white' : 'bg-white'}`}>
        <DialogHeader>
          <DialogTitle className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>프로필 수정</DialogTitle>
        </DialogHeader>

        {/* 프로필 이미지 + 업로드 */}
        <div className="flex flex-col items-center justify-center mt-4 mb-2">
          <div className={`relative w-24 h-24 rounded-full border overflow-hidden flex items-center justify-center ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
            {imagePreview ? (
              <img
                src={getSafeProfileUrl(imagePreview)}
                alt="Profile"
                className="w-24 h-24 object-cover"
                draggable={false}
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
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
              id="image-upload"                 // ⬅️ 훅이 참조하므로 id 유지
              type="file"
              accept="image/jpeg,image/png,image/gif"
              className="hidden"
              onChange={handleImageUpload}      // ⬅️ 훅 연결
              disabled={isImageProcessing}
            />
          </div>

          <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            이미지는 10MB 이하, 정해진 비율에 맞는 이미지만 업로드 가능해요.
          </p>

          {(imagePreview || selectedImage) && (
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                className={`text-xs underline ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}
                onClick={() => {
                  // 완전 삭제: 미리보기/기존URL 비우기 → 저장 시 null 전달됨
                  setImagePreview('');
                  setExistingImageUrl('');
                  const input = document.getElementById('image-upload') as HTMLInputElement | null;
                  if (input) input.value = '';
                }}
                disabled={isImageProcessing}
              >
                이미지 제거
              </button>
            </div>
          )}
        </div>

        {/* 입력 필드 */}
        <div className="space-y-4 mt-2">
          <div>
            <label className={`text-sm font-medium flex items-center justify-between ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              <span>닉네임</span>
              <span className={`text-xs flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {isCheckingDup ? (
                  <span className="animate-pulse">중복 확인 중…</span>
                ) : isValidNickname((nickname ?? '').trim()) &&
                  (nickname ?? '').trim() !== (initialNickname ?? '') ? (
                  isDuplicated ? (
                    <span className="text-red-500">사용 불가</span>
                  ) : (
                    <span className="text-green-600">사용 가능</span>
                  )
                ) : null}
                <span>{countAllowed(nickname)}/8</span>
              </span>
            </label>
            <Input
              value={nickname}
              onChange={handleNicknameChange}
              onBlur={handleNicknameBlur}
              disabled={!!nicknameDisabled}
              placeholder="완성형 한글/영문/숫자 (2~8자)"
              aria-invalid={!!nicknameError}
              aria-describedby={nicknameError ? 'nickname-error' : undefined}
              inputMode="text"
            />
            {(nicknameHelperText || nicknameError) && (
              <p
                id="nickname-error"
                className={`mt-1 text-xs ${nicknameError ? 'text-red-500' : 'text-gray-500'}`}
              >
                {nicknameError ?? nicknameHelperText}
              </p>
            )}
          </div>

          <div>
            <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>블로그 URL</label>
            <Input
              value={blogUrl}
              onChange={onBlogChange}
              onBlur={onBlogBlur}
              placeholder="blog.naver.com/..., *.tistory.com, velog.io/..."
              aria-invalid={!!blogError}
              aria-describedby={blogError ? 'blog-error' : undefined}
              inputMode="url"
            />
            {blogError && (
              <p id="blog-error" className="mt-1 text-xs text-red-500">
                {blogError}
              </p>
            )}
          </div>

          <div>
            <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>GitHub URL</label>
            <Input
              value={githubUrl}
              onChange={onGithubChange}
              onBlur={onGithubBlur}
              placeholder="github.com/사용자명 또는 사용자명.github.io"
              aria-invalid={!!githubError}
              aria-describedby={githubError ? 'github-error' : undefined}
              inputMode="url"
            />
            {githubError && (
              <p id="github-error" className="mt-1 text-xs text-red-500">
                {githubError}
              </p>
            )}
          </div>
        </div>

        {/* 버튼 */}
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