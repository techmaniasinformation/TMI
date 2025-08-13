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

// ✅ 자모 금지(완성형만 허용), 2~8자
const NICKNAME_RE = /^[가-힣a-zA-Z0-9]{2,8}$/;
const isValidNickname = (v: string) => NICKNAME_RE.test(v);

// ✅ 유효 글자(완성형 한글/영문/숫자) 카운트 & 금지문자 체크 헬퍼
const ALLOWED_CHAR_RE = /[가-힣a-zA-Z0-9]/;
const hasDisallowed = (s: string) => /[^가-힣a-zA-Z0-9]/.test(s);
const countAllowed = (s: string) =>
  Array.from(s).reduce((n, ch) => n + (ALLOWED_CHAR_RE.test(ch) ? 1 : 0), 0);

// 🔗 닉네임 중복 확인 API
const DUP_API = 'https://i13a509.p.ssafy.io/api/v1/member/duplicate?nickname=';

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
  const [nicknameError, setNicknameError] = useState<string | null>(null);

  const [blogUrl, setBlogUrl] = useState(initialBlogUrl);
  const [githubUrl, setGithubUrl] = useState(initialGithubUrl || '');
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialProfileImageUrl || null);

  // 이미지 상태
  const [imgLoading, setImgLoading] = useState(false);
  const fallbackAppliedRef = useRef(false);

  // 파일 업로드 상태
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ✅ 이미지 제거 의도 플래그
  const [removed, setRemoved] = useState(false);

  // ✅ 닉네임 중복 검사 상태
  const [isCheckingDup, setIsCheckingDup] = useState(false);
  const [isDuplicated, setIsDuplicated] = useState(false);
  const dupAbortRef = useRef<AbortController | null>(null);
  const dupTimerRef = useRef<number | null>(null);

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
    setNicknameError(null);
    setBlogUrl(initialBlogUrl);
    setGithubUrl(initialGithubUrl || '');
    setPreviewUrl(initialProfileImageUrl || null);
    setSelectedFile(null);
    setImgLoading(!!initialProfileImageUrl);
    fallbackAppliedRef.current = false;
    setRemoved(false);
    setIsDuplicated(false);
    setIsCheckingDup(false);
  }, [isOpen, initialNickname, initialBlogUrl, initialGithubUrl, initialProfileImageUrl]);

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

  // ✅ 닉네임 입력: 화면엔 그대로 보이되, "유효 글자"만 8자까지 허용
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;

    const currentAllowed = countAllowed(nickname);
    const nextAllowed = countAllowed(next);

    if (nextAllowed <= currentAllowed) {
      setNickname(next);
    } else {
      if (nextAllowed <= 8) {
        setNickname(next);
      }
    }

    const allowedCount = countAllowed(next);
    if (hasDisallowed(next)) {
      setNicknameError('허용 외 문자가 포함되어 있어요 (자모·특수·공백 등).');
    } else if (allowedCount < 2) {
      setNicknameError('닉네임은 2~8자의 완성형 한글/영문/숫자만 가능합니다.');
    } else {
      setNicknameError(null);
    }
  };

  // ✅ 닉네임 중복 검사 (디바운스 + AbortController)
  useEffect(() => {
    const value = (nickname ?? '').trim();

    // 타이머/요청 정리
    if (dupTimerRef.current) {
      clearTimeout(dupTimerRef.current);
      dupTimerRef.current = null;
    }
    dupAbortRef.current?.abort();

    // 검사 필요 조건: 유효 형식 통과 + 기존 닉네임과 다를 때 + 수정 가능할 때
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
          // 에러 메시지는 여기서도 업데이트(형식 에러가 없는 경우에만)
          setNicknameError((prev) => {
            // 기존에 형식/기타 에러가 있으면 그대로 두고, 없으면 중복 에러 반영
            if (prev && prev !== '이미 사용 중인 닉네임입니다.') return prev;
            return duplicated ? '이미 사용 중인 닉네임입니다.' : null;
          });
        } catch {
          // 네트워크 오류는 저장 자체를 막진 않고 안내만
          setNicknameError((prev) => prev ?? null);
        } finally {
          setIsCheckingDup(false);
          dupAbortRef.current = null;
        }
      }, 400); // 400ms 디바운스
    } else {
      // 검사 조건이 아니면 상태 초기화
      setIsCheckingDup(false);
      setIsDuplicated(false);
      // 형식 에러는 유지, 중복 에러는 제거
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
    if (!isValidNickname(v)) {
      setNicknameError('닉네임은 2~8자의 완성형 한글/영문/숫자만 가능합니다.');
    } else if (isDuplicated) {
      setNicknameError('이미 사용 중인 닉네임입니다.');
    } else {
      setNicknameError(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setRemoved(false);

    if (file) {
      const MAX_SIZE = 10 * 1024 * 1024; // 10MB
      const MAX_WIDTH = 1024;
      const MAX_HEIGHT = 1024;

      const okType = /^image\//.test(file.type);
      if (!okType) {
        alert('이미지 파일만 업로드 가능합니다.');
        e.target.value = '';
        return;
      }
      if (file.size > MAX_SIZE) {
        alert('이미지는 10MB 이하만 업로드 가능합니다.');
        e.target.value = '';
        return;
      }

      const tempUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const w = img.width;
        const h = img.height;
        URL.revokeObjectURL(tempUrl);

        if (w > MAX_WIDTH || h > MAX_HEIGHT) {
          alert(`이미지 크기는 ${MAX_WIDTH}x${MAX_HEIGHT}px 이하만 가능합니다.\n(현재: ${w}x${h}px)`);
          e.target.value = '';
          return;
        }

        setSelectedFile(file);
        fallbackAppliedRef.current = false;
        setImgLoading(true);
        setPreviewUrl(URL.createObjectURL(file));
      };
      img.onerror = () => {
        URL.revokeObjectURL(tempUrl);
        alert('이미지 로드에 실패했습니다. 다른 파일을 선택해 주세요.');
        e.target.value = '';
      };
      img.src = tempUrl;
      return;
    }

    setSelectedFile(null);
    fallbackAppliedRef.current = false;
    setImgLoading(!!initialProfileImageUrl);
    setPreviewUrl(initialProfileImageUrl || null);
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const [saving, setSaving] = useState(false);
  const handleSubmit = async () => {
    if (saving) return;

    const cleanNickname = (nickname ?? '').trim();
    // 최종 가드
    if (!isValidNickname(cleanNickname)) {
      setNicknameError('닉네임은 2~8자의 완성형 한글/영문/숫자만 가능합니다.');
      return;
    }
    if (isCheckingDup) return;         // 검사 중엔 저장 불가
    if (isDuplicated && cleanNickname !== (initialNickname ?? '')) {
      setNicknameError('이미 사용 중인 닉네임입니다.');
      return;
    }

    setSaving(true);
    try {
      const isSameAsInitial =
        !selectedFile && (previewUrl ?? '') === (initialProfileImageUrl ?? '');

      const profileArg: string | null | undefined =
        removed ? null : (isSameAsInitial ? undefined : (previewUrl ?? undefined));

      const nothingChanged =
        !removed &&
        cleanNickname === (initialNickname ?? '') &&
        (blogUrl ?? '') === (initialBlogUrl ?? '') &&
        (githubUrl ?? '') === (initialGithubUrl ?? '') &&
        !selectedFile &&
        isSameAsInitial;

      if (nothingChanged) {
        onClose();
        return;
      }

      await onSave(cleanNickname, blogUrl, githubUrl, profileArg, selectedFile);

      onClose();
      window.location.reload();
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

        {/* 프로필 이미지 + 카메라 아이콘 업로드 (중앙 오버레이) */}
        <div className="flex flex-col items-center justify-center mt-4 mb-2">
          <div className="relative w-24 h-24 rounded-full border border-gray-300 overflow-hidden flex items-center justify-center">
            {previewUrl ? (
              <>
                {imgLoading && <div className="w-full h-full animate-pulse bg-gray-100" />}
                <img
                  key={previewUrl}
                  src={getSafeProfileUrl(previewUrl)}
                  alt="Profile"
                  className={`w-24 h-24 object-contain ${imgLoading ? 'hidden' : 'block'}`}
                  onLoad={handleImgLoad}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = getSafeProfileUrl(null);
                  }}
                  draggable={false}
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                No Image
              </div>
            )}

            <button
              type="button"
              onClick={openFilePicker}
              className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition"
              aria-label="Change profile image"
              title="Change profile image"
            >
              <Camera className="w-6 h-6 text-white" />
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-2">
            이미지는 10MB 이하, 최대 1024×1024px만 업로드할 수 있어요.
          </p>
          {(previewUrl || selectedFile) && (
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
                setRemoved(true);
              }}
              className="mt-2 text-xs text-gray-500 underline"
            >
              이미지 제거
            </button>
          )}
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
            {/* ✅ 글자수 + 중복 상태 표시 */}
            <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
              <span>닉네임</span>
              <span className="text-xs text-gray-500 flex items-center gap-2">
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
            disabled={
              saving ||
              !!nicknameError ||
              !isValidNickname((nickname ?? '').trim()) ||
              isCheckingDup ||
              (isDuplicated && (nickname ?? '').trim() !== (initialNickname ?? ''))
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
