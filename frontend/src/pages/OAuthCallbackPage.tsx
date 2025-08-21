import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/store/useStoreActions';

const OAuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('인증 처리 중...');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        

        // URL에서 에러 파라미터 확인
        const error = searchParams.get('error');
        if (error) {
          console.error('[OAUTH_CALLBACK] OAuth 에러:', error);
          setStatus('error');
          setMessage(`인증 실패: ${error}`);
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // 인증 코드 확인
        const code = searchParams.get('code');
        if (!code) {
          console.error('[OAUTH_CALLBACK] 인증 코드 없음');
          setStatus('error');
          setMessage('인증 코드를 받지 못했습니다.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }



        // 잠시 대기 후 인증 상태 확인
        setTimeout(async () => {
          try {
    
            await checkAuth();
            
            
            setStatus('success');
            setMessage('로그인 성공! 메인 페이지로 이동합니다.');
            
            setTimeout(() => navigate('/home'), 2000);
          } catch (error) {
            console.error('[OAUTH_CALLBACK] 인증 상태 확인 실패:', error);
            setStatus('error');
            setMessage('로그인 상태 확인에 실패했습니다.');
            setTimeout(() => navigate('/login'), 3000);
          }
        }, 1000);

      } catch (error) {
        console.error('[OAUTH_CALLBACK] 콜백 처리 오류:', error);
        setStatus('error');
        setMessage('인증 처리 중 오류가 발생했습니다.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, checkAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">인증 처리 중</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="text-green-500 text-4xl mb-4">✓</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">로그인 성공!</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="text-red-500 text-4xl mb-4">✗</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">인증 실패</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;
