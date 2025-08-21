import { useCallback, useEffect, useRef } from 'react';
import { isValidNickname } from '@/utils/validationUtils';
import { checkNicknameDuplicate } from '@/api/profile/profileEditService';
import type { useProfileEditState } from './useProfileEditState';

export function useProfileEditNickname(
  state: ReturnType<typeof useProfileEditState>,
  initialNickname: string,
  nicknameDisabled?: boolean
) {
  const { nickname, setNicknameError, setDuplicateStatus } = state;

  // 닉네임 중복 검사 관련 refs
  const dupAbortRef = useRef<AbortController | null>(null);
  const dupTimerRef = useRef<number | null>(null);

  // 닉네임 변경
  const handleNicknameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    state.setNickname(next);
    if (!isValidNickname(next)) {
      state.setNicknameError('닉네임은 2~8자의 완성형 한글/영문/숫자만 가능합니다.');
    } else {
      state.setNicknameError(null);
    }
  }, [state]);

  const handleNicknameBlur = useCallback(() => {
    const v = (nickname ?? '').trim();
    state.setNickname(v);
    if (!isValidNickname(v)) {
      state.setNicknameError('닉네임은 2~8자의 완성형 한글/영문/숫자만 가능합니다.');
    } else if (state.isDuplicated) {
      state.setNicknameError('이미 사용 중인 닉네임입니다.');
    } else {
      state.setNicknameError(null);
    }
  }, [nickname, state]);

  // 닉네임 중복 검사 (디바운스 + AbortController)
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
      setDuplicateStatus(true, false);

      dupTimerRef.current = window.setTimeout(async () => {
        const controller = new AbortController();
        dupAbortRef.current = controller;
        try {
          const duplicated = await checkNicknameDuplicate(value, controller.signal);
          setDuplicateStatus(false, duplicated);
          
          if (duplicated) {
            setNicknameError('이미 사용 중인 닉네임입니다.');
          }
        } catch {
          // 에러 무시 (중단된 요청)
        } finally {
          dupAbortRef.current = null;
        }
      }, 400);
    } else {
      setDuplicateStatus(false, false);
      if (state.nicknameError === '이미 사용 중인 닉네임입니다.') {
        setNicknameError(null);
      }
    }

    return () => {
      if (dupTimerRef.current) {
        clearTimeout(dupTimerRef.current);
        dupTimerRef.current = null;
      }
      dupAbortRef.current?.abort();
    };
  }, [nickname, initialNickname, nicknameDisabled, setDuplicateStatus, setNicknameError, state.nicknameError]);

  return {
    handleNicknameChange,
    handleNicknameBlur,
  };
}
