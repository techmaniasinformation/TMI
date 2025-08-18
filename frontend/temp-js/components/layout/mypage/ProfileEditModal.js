import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay } from '@/components/domain/Dialog';
import { Input } from '@/components/domain/Input';
import { Button } from '@/components/foundation/button';
import { Camera } from 'lucide-react';
import { getSafeProfileUrl, handleProfileImageError } from '@/utils/defaultImages';
import { useThemeStore } from '@/stores/themeStore';
import { useImageCompression } from '@/hooks/useImageCompression';
const NICKNAME_RE = /^[가-힣a-zA-Z0-9]{2,8}$/;
const isValidNickname = v => NICKNAME_RE.test(v);

// 🔗 닉네임 중복 확인 API
const DUP_API = 'https://i13a509.p.ssafy.io/api/v1/member/duplicate?nickname=';

// 블로그 허용 도메인
const ALLOWED_BLOG_HOSTS = ['tistory.com', 'velog.io', 'blog.naver.com'];
const isAllowedBlogHost = hostname => ALLOWED_BLOG_HOSTS.some(host => hostname === host || hostname.endsWith('.' + host));
const validateBlogUrl = raw => {
  const v = (raw ?? '').trim();
  if (!v) return {
    ok: true,
    value: ''
  };
  try {
    const u = new URL(v.startsWith('http') ? v : 'https://' + v);
    if (!isAllowedBlogHost(u.hostname)) {
      return {
        ok: false,
        msg: '티스토리, 벨로그, 네이버 블로그만 허용됩니다.'
      };
    }
    return {
      ok: true,
      value: u.toString()
    };
  } catch {
    return {
      ok: false,
      msg: '올바른 URL 형식이 아닙니다.'
    };
  }
};

// GitHub 검증
const validateGithubUrl = raw => {
  const v = (raw ?? '').trim();
  if (!v) return {
    ok: true,
    value: ''
  };
  try {
    const u = new URL(v.startsWith('http') ? v : 'https://' + v);
    const host = u.hostname;
    const isGithubCom = host === 'github.com';
    const isGithubIo = host.endsWith('.github.io');
    if (!isGithubCom && !isGithubIo) {
      return {
        ok: false,
        msg: 'GitHub 주소만 등록할 수 있어요.'
      };
    }
    if (isGithubCom && (!u.pathname || u.pathname === '/')) {
      return {
        ok: false,
        msg: 'github.com/사용자명 또는 저장소 주소를 입력해주세요.'
      };
    }
    return {
      ok: true,
      value: u.toString()
    };
  } catch {
    return {
      ok: false,
      msg: '올바른 URL 형식이 아닙니다.'
    };
  }
};
const ProfileEditModal = ({
  isOpen,
  onClose,
  initialNickname,
  initialBlogUrl,
  initialGithubUrl,
  initialProfileImageUrl,
  nicknameDisabled,
  nicknameHelperText,
  onSave
}) => {
  const {
    isDarkMode
  } = useThemeStore();
  const {
    selectedImage,
    imagePreview,
    existingImageUrl,
    handleImageUpload,
    setImagePreview,
    setExistingImageUrl,
    setSelectedImage
  } = useImageCompression();
  const [nickname, setNickname] = useState(initialNickname);
  const [nicknameError, setNicknameError] = useState(null);
  const [blogUrl, setBlogUrl] = useState(initialBlogUrl || '');
  const [blogError, setBlogError] = useState('');
  const [githubUrl, setGithubUrl] = useState(initialGithubUrl || '');
  const [githubError, setGithubError] = useState('');
  const [saving, setSaving] = useState(false);

  // ✅ 닉네임 중복 검사 상태
  const [isCheckingDup, setIsCheckingDup] = useState(false);
  const [isDuplicated, setIsDuplicated] = useState(false);
  const dupAbortRef = useRef(null);
  const dupTimerRef = useRef(null);

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
      setIsDuplicated(false);
      setIsCheckingDup(false);
    }
  }, [isOpen, initialNickname, initialBlogUrl, initialGithubUrl, initialProfileImageUrl, setImagePreview, setExistingImageUrl, setSelectedImage]);

  // 닉네임 변경
  const handleNicknameChange = e => {
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
    } else if (isDuplicated) {
      setNicknameError('이미 사용 중인 닉네임입니다.');
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
            signal: controller.signal
          });
          const json = await res.json().catch(() => null);
          const duplicated = !!json?.data?.isDuplicated;
          setIsDuplicated(duplicated);
          // 에러 메시지는 여기서도 업데이트(형식 에러가 없는 경우에만)
          setNicknameError(prev => {
            // 기존에 형식/기타 에러가 있으면 그대로 두고, 없으면 중복 에러 반영
            if (prev && prev !== '이미 사용 중인 닉네임입니다.') return prev;
            return duplicated ? '이미 사용 중인 닉네임입니다.' : null;
          });
        } catch {
          // 네트워크 오류는 저장 자체를 막진 않고 안내만
          setNicknameError(prev => prev ?? null);
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
      setNicknameError(prev => prev === '이미 사용 중인 닉네임입니다.' ? null : prev);
    }
    return () => {
      if (dupTimerRef.current) {
        clearTimeout(dupTimerRef.current);
        dupTimerRef.current = null;
      }
      dupAbortRef.current?.abort();
    };
  }, [nickname, initialNickname, nicknameDisabled]);

  // 블로그/GitHub URL
  const onBlogChange = e => {
    setBlogUrl(e.target.value);
    if (blogError) setBlogError('');
  };
  const onGithubChange = e => {
    setGithubUrl(e.target.value);
    if (githubError) setGithubError('');
  };
  const onBlogBlur = () => {
    const r = validateBlogUrl(blogUrl);
    if (!r.ok) setBlogError(r.msg);else {
      setBlogError('');
      setBlogUrl(r.value || '');
    }
  };
  const onGithubBlur = () => {
    const r = validateGithubUrl(githubUrl);
    if (!r.ok) setGithubError(r.msg);else {
      setGithubError('');
      setGithubUrl(r.value || '');
    }
  };
  const handleSubmit = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const isDelete = !imagePreview && !existingImageUrl && !selectedImage;
      await onSave(nickname.trim(), blogUrl.trim(), githubUrl.trim(), isDelete ? null : undefined, selectedImage ?? null);
      onClose();
    } finally {
      setSaving(false);
    }
  };
  return /*#__PURE__*/React.createElement(Dialog, {
    open: isOpen,
    onOpenChange: onClose
  }, /*#__PURE__*/React.createElement(DialogOverlay, {
    className: "fixed inset-0 bg-black/70 z-40"
  }), /*#__PURE__*/React.createElement(DialogContent, {
    className: `w-[512px] z-50 rounded-lg shadow-lg ${isDarkMode ? 'bg-zinc-800 text-white' : 'bg-white'}`
  }, /*#__PURE__*/React.createElement(DialogHeader, null, /*#__PURE__*/React.createElement(DialogTitle, {
    className: `text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`
  }, "\uD504\uB85C\uD544 \uC218\uC815")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center justify-center mt-4 mb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: `relative w-24 h-24 rounded-full border overflow-hidden flex items-center justify-center ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`
  }, imagePreview || existingImageUrl ? /*#__PURE__*/React.createElement("img", {
    src: getSafeProfileUrl(imagePreview || existingImageUrl),
    alt: "Profile",
    className: "w-24 h-24 object-cover",
    draggable: false,
    onError: handleProfileImageError // ← 추가
  }) : /*#__PURE__*/React.createElement("img", {
    src: getSafeProfileUrl(null) // 기본 이미지 표시
    ,
    alt: "Profile",
    className: "w-24 h-24 object-cover",
    draggable: false,
    onError: handleProfileImageError
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "image-upload",
    className: "absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition cursor-pointer"
  }, /*#__PURE__*/React.createElement(Camera, {
    className: "w-6 h-6 text-white"
  })), /*#__PURE__*/React.createElement("input", {
    id: "image-upload",
    type: "file",
    accept: "image/*",
    className: "hidden",
    onChange: handleImageUpload
  })), (imagePreview || selectedImage) && /*#__PURE__*/React.createElement("div", {
    className: "mt-2 flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: `text-xs underline ${isDarkMode ? 'text-red-400' : 'text-red-600'}`,
    onClick: () => {
      setImagePreview('');
      setExistingImageUrl('');
      setSelectedImage(null);
      const input = document.getElementById('image-upload');
      if (input) input.value = '';
    }
  }, "\uC774\uBBF8\uC9C0 \uC81C\uAC70"))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4 mt-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: `text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`
  }, "\uB2C9\uB124\uC784"), /*#__PURE__*/React.createElement(Input, {
    value: nickname,
    onChange: handleNicknameChange,
    onBlur: handleNicknameBlur,
    disabled: !!nicknameDisabled,
    placeholder: "\uC644\uC131\uD615 \uD55C\uAE00/\uC601\uBB38/\uC22B\uC790 (2~8\uC790)",
    "aria-invalid": !!nicknameError
  }), (nicknameHelperText || nicknameError || isCheckingDup || isDuplicated) && /*#__PURE__*/React.createElement("p", {
    className: `mt-1 text-xs ${nicknameError ? 'text-red-500' : isDuplicated ? 'text-red-500' : 'text-gray-500'}`
  }, nicknameError ? nicknameError : isCheckingDup ? '중복 확인 중...' : isDuplicated ? '이미 사용 중인 닉네임입니다.' : nicknameHelperText || '사용 가능한 닉네임입니다.')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: `text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`
  }, "\uBE14\uB85C\uADF8 URL"), /*#__PURE__*/React.createElement(Input, {
    value: blogUrl,
    onChange: onBlogChange,
    onBlur: onBlogBlur,
    placeholder: "blog.naver.com/..., *.tistory.com, velog.io/...",
    "aria-invalid": !!blogError,
    inputMode: "url"
  }), blogError && /*#__PURE__*/React.createElement("p", {
    className: "mt-1 text-xs text-red-500"
  }, blogError)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: `text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`
  }, "GitHub URL"), /*#__PURE__*/React.createElement(Input, {
    value: githubUrl,
    onChange: onGithubChange,
    onBlur: onGithubBlur,
    placeholder: "github.com/\uC0AC\uC6A9\uC790\uBA85 \uB610\uB294 \uC0AC\uC6A9\uC790\uBA85.github.io",
    "aria-invalid": !!githubError,
    inputMode: "url"
  }), githubError && /*#__PURE__*/React.createElement("p", {
    className: "mt-1 text-xs text-red-500"
  }, githubError))), /*#__PURE__*/React.createElement("div", {
    className: "pt-6"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: handleSubmit,
    disabled: saving || !!nicknameError || !isValidNickname((nickname ?? '').trim()) || !!blogError || !!githubError || isDuplicated,
    className: `w-full h-10 text-white font-semibold ${saving ? 'opacity-60 cursor-not-allowed' : ''}`
  }, saving ? '저장 중…' : '저장하기'))));
};
export default ProfileEditModal;