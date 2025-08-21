import { useState, useEffect } from 'react';

// 닉네임 쿨타임 유틸
const NICK_COOLDOWN_KEY = (memberId: number) => `nicknameCooldown:${memberId}`;

function getDaysLeft(ts?: number): number {
  if (!ts) return 0;
  const unlock = ts + 7 * 24 * 60 * 60 * 1000;
  const diff = unlock - Date.now();
  return diff > 0 ? Math.ceil(diff / (24 * 60 * 60 * 1000)) : 0;
}

export function useNicknameCooldown(memberId: number | undefined, currentNickname?: string) {
  const [nicknameDaysLeft, setNicknameDaysLeft] = useState(0);

  // 닉네임 쿨타임 계산
  useEffect(() => {
    if (!memberId || memberId <= 0) return;

    try {
      const raw = localStorage.getItem(NICK_COOLDOWN_KEY(memberId));
      if (raw) {
        const saved = JSON.parse(raw) as { lastChangedAt: number; nickname: string };
        // 서버 닉네임과 저장된 닉네임이 다르면(다른 브라우저/기기에서 변경됨) 지금부터 7일로 리셋
        if ((saved.nickname ?? '') !== (currentNickname ?? '')) {
          localStorage.setItem(
            NICK_COOLDOWN_KEY(memberId),
            JSON.stringify({ lastChangedAt: Date.now(), nickname: currentNickname ?? '' })
          );
          setNicknameDaysLeft(7);
        } else {
          setNicknameDaysLeft(getDaysLeft(saved.lastChangedAt));
        }
      } else {
        setNicknameDaysLeft(0);
      }
    } catch {
      setNicknameDaysLeft(0);
    }
  }, [memberId, currentNickname]);

  // 닉네임 쿨타임 기록
  const recordNicknameChange = (newNickname: string) => {
    if (!memberId || memberId <= 0) return;
    
    localStorage.setItem(
      NICK_COOLDOWN_KEY(memberId),
      JSON.stringify({ lastChangedAt: Date.now(), nickname: newNickname })
    );
  };

  return {
    nicknameDaysLeft,
    recordNicknameChange,
  };
}
