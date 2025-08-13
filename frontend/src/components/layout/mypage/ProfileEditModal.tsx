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
  // ⬇️ 훅 사용
  const {
    selectedImage,
    imagePreview,
    isImageProcessing,
    existingImageUrl,
    handleImageUpload,
    handleImageCancel,
    setImagePreview,
    setExistingImageUrl,
  } = useImageCompression();

  const [nickname, setNickname] = useState(initialNickname);
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [blogUrl, setBlogUrl] = useState(initialBlogUrl);
  const [githubUrl, setGithubUrl] = useState(initialGithubUrl || '');

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
    // 이미지 관련 초기화는 훅이 처리하므로 여기선 건드리지 않음
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

  // 저장
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

    setSaving(true);
    try {
      // 삭제 의도: 미리보기/기존URL/선택파일 모두 없음 → null 전송
      const isDelete = !imagePreview && !existingImageUrl && !selectedImage;

      await onSave(
        cleanNickname,
        blogUrl,
        githubUrl,
        isDelete ? null : undefined,       // 삭제면 null, 유지면 undefined
        selectedImage ?? null              // 새 이미지가 있으면 파일 전달
      );

      onClose();
      // 필요 시 유지
      // window.location.reload();
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
                className="w-24 h-24 object-cover rounded-full"
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
              id="image-upload"                 // ⬅️ 훅이 참조하므로 id 유지
              type="file"
              accept="image/jpeg,image/png,image/gif"
              className="hidden"
              onChange={handleImageUpload}      // ⬅️ 훅 연결
              disabled={isImageProcessing}
            />
          </div>

          <p className="text-sm text-gray-500 mt-2">
            이미지는 10MB 이하, 정해진 비율에 맞는 이미지만 업로드 가능해요.
          </p>

          {(imagePreview || selectedImage) && (
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                className="text-xs text-red-600 underline"
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
              isImageProcessing ||                                  // ⬅️ 처리 중엔 비활성
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
