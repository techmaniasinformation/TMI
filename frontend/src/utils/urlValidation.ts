// URL 검증 유틸리티

// 허용된 블로그 도메인들
const ALLOWED_BLOG_DOMAINS = [
  'tistory.com',
  'velog.io', 
  'blog.naver.com',
  'medium.com'
];

// URL 검증 및 처리
export function validateAndProcessUrl(url: string): { isValid: boolean; processedUrl?: string; error?: string } {
  if (!url.trim()) {
    return { isValid: true };
  }

  let processedUrl = url.trim();
  
  // 프로토콜 추가
  if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
    processedUrl = `https://${processedUrl}`;
  }

  try {
    const urlObj = new URL(processedUrl);
    
    // 프로토콜 검증
    if (!urlObj.protocol || !urlObj.protocol.startsWith('http')) {
      return { 
        isValid: false, 
        error: 'http 또는 https URL을 입력해주세요.' 
      };
    }

    // 도메인 검증
    const hostname = urlObj.hostname.toLowerCase();
    const isAllowedDomain = ALLOWED_BLOG_DOMAINS.some(domain => 
      hostname.includes(domain)
    );

    if (!isAllowedDomain) {
      return { 
        isValid: false, 
        error: '티스토리(tistory.com), 벨로그(velog.io), 네이버 블로그(blog.naver.com), Medium(medium.com) 링크만 허용됩니다.' 
      };
    }

    return { isValid: true, processedUrl };
  } catch (error) {
    return { 
      isValid: false, 
      error: '올바른 URL 형식을 입력해주세요.' 
    };
  }
}

