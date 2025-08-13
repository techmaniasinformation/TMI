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
    profileImageUrl?: string | null, // ← 삭제 의도면 null 전달
    file?: File | null
  ) => Promise<void>;
}

const NICKNAME_RE = /^[ㄱ-ㅎ가-힣a-zA-Z0-9]{2,16}$/;
const isValidNickname = (v: string) => NICKNAME_RE.test(v);

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
    setRemoved(false); // ✅ 모달 열릴 때 제거 플래그 리셋
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

  // ✅ 닉네임: 한글/영문/숫자만 허용 (공백·특수문자 제거) + 길이 검증
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 허용 문자 외 제거 (공백, 특수문자, 이모지 등)
    const filtered = value.replace(/[^ㄱ-ㅎ가-힣a-zA-Z0-9]/g, '');
    setNickname(filtered);

    // 실시간 길이/형식 체크
    if (filtered.length === 0) {
      setNicknameError('닉네임을 입력해 주세요.');
    } else if (!isValidNickname(filtered)) {
      setNicknameError('닉네임은 2~16자의 한글/영문/숫자만 가능합니다.');
    } else {
      setNicknameError(null);
    }
  };

  // 포커스 아웃 시 안전망(공백은 이미 입력 단계에서 제거되지만 한 번 더 보정)
  const handleNicknameBlur = () => {
    const v = (nickname ?? '').trim();
    setNickname(v);
    if (!isValidNickname(v)) {
      setNicknameError('닉네임은 2~16자의 한글/영문/숫자만 가능합니다.');
    } else {
      setNicknameError(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setRemoved(false); // ✅ 파일 선택하면 제거 의도 해제

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

      // 📏 가로/세로 길이 제한 검사
      const tempUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const w = img.width;
        const h = img.height;
        URL.revokeObjectURL(tempUrl); // 임시 URL 정리

        if (w > MAX_WIDTH || h > MAX_HEIGHT) {
          alert(`이미지 크기는 ${MAX_WIDTH}x${MAX_HEIGHT}px 이하만 가능합니다.\n(현재: ${w}x${h}px)`);
          e.target.value = '';
          return;
        }

        // ✅ 통과 시 미리보기/상태 반영
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

    // 파일 선택 취소
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
    // 저장 직전 최종 검증(서버 호출 차단)
    if (!isValidNickname(cleanNickname)) {
      setNicknameError('닉네임은 2~16자의 한글/영문/숫자만 가능합니다.');
      return;
    }

    setSaving(true);
    try {
      // 파일 없음 + 프리뷰가 초기 이미지와 같으면 URL은 보내지 않음(= undefined)
      const isSameAsInitial =
        !selectedFile && (previewUrl ?? '') === (initialProfileImageUrl ?? '');

      // ✅ 제거면 null, 유지면 undefined, 프리뷰 변경이면 그 값
      const profileArg: string | null | undefined =
        removed ? null : (isSameAsInitial ? undefined : (previewUrl ?? undefined));

      // ✅ 아무 것도 안 바뀐 경우만 스킵 (제거 의도면 변경으로 간주)
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

      await onSave(
        cleanNickname,
        blogUrl,
        githubUrl,
        profileArg,
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
            이미지는 10MB 이하, 최대 1024×1024px만 업로드할 수 있어요.
          </p>
          {(previewUrl || selectedFile) && (
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
                setRemoved(true); // ✅ 제거 의도 ON
              }}
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
              onChange={handleNicknameChange}
              onBlur={handleNicknameBlur}
              disabled={!!nicknameDisabled}
              placeholder="한글/영문/숫자만 입력 (2~16자)"
              aria-invalid={!!nicknameError}
              aria-describedby={nicknameError ? 'nickname-error' : undefined}
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
            disabled={saving || !!nicknameError || (nickname ?? '').length === 0}
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
