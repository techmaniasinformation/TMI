import { useState, useEffect } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { useAlertStore } from '@/stores/alertStore';

const useMessageHandler = (isHandled: boolean, setIsHandled: React.Dispatch<React.SetStateAction<boolean>>, navigate: NavigateFunction) => {
  const [messageData, setMessageData] = useState<any>(null);
  const { showError } = useAlertStore();

  useEffect(() => {
    if (messageData) {
      console.log('📌 메시지 수신:', messageData);
      if (messageData.status === 'SUCCESS') {
        console.log('🎉 로그인 성공');
        if (messageData.data && messageData.data.isNew) {
          console.log('🆕 신규 회원 - /signup으로 이동');
          navigate('/signup');
        } else {
          console.log('👤 기존 회원 - 이전 페이지로 이동');
          navigate(-1);
        }
      } else {
        console.error('❌ 로그인 실패:', messageData.message);
        showError('로그인에 실패했습니다.');
      }
    }
  }, [messageData, navigate]);

  const handleMessage = (event: MessageEvent, popup: Window | null, isHandledLocal: boolean) => {
    if (isHandled || isHandledLocal) {
      console.log('⚠️ 이미 처리된 메시지 무시');
      return;
    }

    console.log('📨 메시지 수신:', {
      origin: event.origin,
      data: event.data,
      type: typeof event.data,
    });

    const allowedOrigins = [
      'https://i13a509.p.ssafy.io',
      'http://localhost:8080',
      'http://localhost:3000',
    ];

    if (!allowedOrigins.includes(event.origin)) {
      console.log('❌ 허용되지 않은 origin:', event.origin);
      return;
    }

    try {
      const messageData =
        typeof event.data === 'string' ? event.data : JSON.stringify(event.data);
      const data = JSON.parse(messageData);

      console.log('✅ 파싱된 데이터:', data);
      setIsHandled(true);
      setMessageData(data); // 메시지 상태 저장
    } catch (err) {
      console.error('❌ 메시지 파싱 실패:', err);
      console.log('원본 데이터:', event.data);
      popup?.close();
    }
  };

  return handleMessage;
};

export default useMessageHandler;
