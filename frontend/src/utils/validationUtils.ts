// 유효성 검사 유틸리티

// 닉네임 검증
const NICKNAME_RE = /^[가-힣a-zA-Z0-9]{2,8}$/;
export const isValidNickname = (v: string) => NICKNAME_RE.test(v);

// 블로그 허용 도메인
const ALLOWED_BLOG_HOSTS = [
  'tistory.com',
  'velog.io',
  'blog.naver.com',
];

const isAllowedBlogHost = (hostname: string) =>
  ALLOWED_BLOG_HOSTS.some((host) => hostname === host || hostname.endsWith('.' + host));

export const validateBlogUrl = (raw: string) => {
  const v = (raw ?? '').trim();
  if (!v) return { ok: true, value: '' };
  try {
    const u = new URL(v.startsWith('http') ? v : 'https://' + v);
    if (!isAllowedBlogHost(u.hostname)) {
      return {
        ok: false,
        msg: '티스토리, 벨로그, 네이버 블로그만 허용됩니다.',
      };
    }
    return { ok: true, value: u.toString() };
  } catch {
    return { ok: false, msg: '올바른 URL 형식이 아닙니다.' };
  }
};

// GitHub 검증
export const validateGithubUrl = (raw: string) => {
  const v = (raw ?? '').trim();
  if (!v) return { ok: true, value: '' };
  try {
    const u = new URL(v.startsWith('http') ? v : 'https://' + v);
    const host = u.hostname;
    const isGithubCom = host === 'github.com';
    const isGithubIo = host.endsWith('.github.io');

    if (!isGithubCom && !isGithubIo) {
      return { ok: false, msg: 'GitHub 주소만 등록할 수 있어요.' };
    }
    if (isGithubCom && (!u.pathname || u.pathname === '/')) {
      return { ok: false, msg: 'github.com/사용자명 또는 저장소 주소를 입력해주세요.' };
    }
    return { ok: true, value: u.toString() };
  } catch {
    return { ok: false, msg: '올바른 URL 형식이 아닙니다.' };
  }
};


