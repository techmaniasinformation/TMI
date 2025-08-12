import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ✅ 팔로우 API: 전역에 팔로우 목록을 싱크하고, 버튼 액션에서 사용
import {
  getMemberFollows,
  getCompanyFollows,
  createMemberFollow,
  deleteMemberFollow,
  createCompanyFollow,
  deleteCompanyFollow,
  findMemberFollowId,
  findCompanyFollowId,
} from '@/api/followService';

// 사용자 정보를 정의하는 타입 (간단 예시 — 실제 타입에 맞게 수정)
interface User {
  memberId: number;
  nickname: string;
  memberProfileUrl: string;
}

// 신규 가입자
interface NewUser {
  provider: string;
  providerMemberId: string;
}

interface UserState {
  // ===== 기본 사용자 상태 =====
  isLogin: boolean; // 페이지 구현되면 삭제 예정 (주석 유지)
  memberId: number;
  user: User | null;
  newUser: NewUser | null;
  starLst: number[];
  followUser: number[];     // 내가 팔로우한 "사용자"의 memberId 목록
  followCompany: number[];  // 내가 팔로우한 "기업"의 companyId 목록

  // 소셜 로그인 정보
  socialProvider: string | null;
  socialProviderId: string | null;

  // 이전 페이지
  prevPath: string | '/';

  // ===== 기존 액션 =====
  toggleIsLogin: () => void;
  setMemberId: (id: number) => void;
  setUser: (user: User) => void;
  clearUser: () => void;
  setStarLst: (list: any[]) => void;
  setFollowUser: (list: any[]) => void;
  setFollowCompany: (list: any[]) => void;
  setSocialLoginInfo: (provider: string, providerId: string) => void;
  clearSocialLoginInfo: () => void;
  setPrevPath: (path: string) => void;

  // checkAuth는 지울 예정 (원본 유지)
  checkAuth: () => Promise<void>;

  // ===== 추가된 팔로우 동기화 상태/액션 =====
  // 전역에 팔로우 목록을 “로드/동기화”하기 위한 것들
  followLoading: boolean;                      // 팔로우 목록 로딩 여부
  loadFollows: (memberId: number) => Promise<void>;  // 특정 사용자 ID 기준 초기 로드
  refreshFollows: () => Promise<void>;        // 현재 로그인 사용자 기준 재로드

  // 팔로우/언팔 버튼 액션 (낙관적 업데이트 + 실패 시 롤백)
  followMember: (followeeId: number) => Promise<void>;
  unfollowMember: (followeeId: number) => Promise<void>;
  followCompanyAction: (companyId: number) => Promise<void>;
  unfollowCompanyAction: (companyId: number) => Promise<void>;

  // (참고) 필요하면 여기에 “탈퇴+로그아웃” 합친 액션도 나중에 추가 가능
}

export const useUserStore = create(
  persist<UserState>(
    // ✅ get 추가: 액션 내부에서 현재 상태를 읽기 위해 필요
    (set, get) => ({
      // ===== 초기 상태 (원본 유지) =====
      isLogin: false, // 기능 수정 후 isLogin 변수 삭제 예정
      memberId: -1,
      user: null,
      newUser: null, // 신규 회원 정보
      starLst: [],
      followUser: [],
      followCompany: [],
      socialProvider: null,
      socialProviderId: null,
      prevPath: '/', // 이전 페이지

      // ===== 기존 액션 (원본 유지) =====
      toggleIsLogin: () => set((state) => ({ isLogin: !state.isLogin })),

      setMemberId: (id: number) =>
        set({
          memberId: id,
          // isLogin: id !== -1
        }),

      // (오타로 보이지만 원본 유지) setNewUSer가 필요하면 타입에 선언 추가 권장
      setNewUSer: (newUser: NewUser) =>
        set({
          newUser,
        }) as any,

      setUser: (user: User) =>
        set({
          user,
          // isLogin: user !== null
        }),

      clearUser: () =>
        set({
          user: null,
          memberId: -1,
          // isLogin: false
          // (선택) 아래 두 줄을 추가하면 로그아웃/탈퇴 시 찌꺼기 방지
          // followUser: [],
          // followCompany: [],
        }),

      setStarLst: (list: number[]) => set({ starLst: list }),
      setFollowUser: (list: number[]) => set({ followUser: list }),
      setFollowCompany: (list: number[]) => set({ followCompany: list }),

      setSocialLoginInfo: (provider: string, providerId: string) =>
        set({ socialProvider: provider, socialProviderId: providerId }),

      clearSocialLoginInfo: () =>
        set({ socialProvider: null, socialProviderId: null }),

      // 이전 페이지 지정
      setPrevPath: (path: string) => set({ prevPath: path }),

      // 지울 예정: (임시) 서버로부터 사용자 인증 상태 확인
      checkAuth: async () => {
        try {
          const res = await fetch(
            'https://i13a509.p.ssafy.io/api/v1/members/me',
            {
              credentials: 'include', // ✅ 쿠키 포함 필수
            }
          );

          if (res.ok) {
            const data: User = await res.json();
            set({
              isLogin: true,
              user: data, // ✅ (임시)
              // memberId: data.memberId,
            });
          } else {
            set({
              isLogin: false,
              user: null, // ✅ (임시)
              memberId: -1,
            });
          }
        } catch (error) {
          console.error('checkAuth error:', error);
          set({
            isLogin: false,
            user: null, // ✅ (임시)
            memberId: -1,
          });
        }
      },

      // ===== 추가된 팔로우 동기화 상태/액션 =====

      // 전역 팔로우 목록 로딩 상태
      followLoading: false,

      // 로그인/앱 진입 시: 내가 팔로우한 회원/기업 ID 목록 로드
      loadFollows: async (memberId: number) => {
        if (!memberId || memberId <= 0) return;
        set({ followLoading: true });
        try {
          // 필요 시 page/size 조정. 데이터가 많다면 while로 모든 페이지 합산 가능
          const [m, c] = await Promise.all([
            getMemberFollows(memberId, 0, 100),
            getCompanyFollows(memberId, 0, 100),
          ]);

          const memberIds: number[] =
            (m?.data?.memberFollows ?? []).map((x: any) => x.memberId);
          const companyIds: number[] =
            (c?.data?.companyFollows ?? []).map((x: any) => x.companyId);

          set({ followUser: memberIds, followCompany: companyIds });
        } catch (err) {
          console.error('팔로우 목록 로드 실패:', err);
        } finally {
          set({ followLoading: false });
        }
      },

      // 현재 로그인된 사용자를 기준으로 재로딩
      refreshFollows: async () => {
        const id = get().user?.memberId ?? get().memberId;
        if (!id || id <= 0) return;
        await get().loadFollows(id);
      },

      // ===== 멤버 팔로우/언팔 (낙관적 업데이트 + 실패 롤백) =====
      followMember: async (followeeId: number) => {
        const followerId = get().user?.memberId ?? get().memberId;
        if (!followerId || followerId <= 0)
          throw new Error('로그인이 필요합니다.');

        const prev = get().followUser;
        if (prev.includes(followeeId)) return; // 이미 팔로우 중

        // 낙관적 추가
        set({ followUser: [...prev, followeeId] });

        try {
          await createMemberFollow(followerId, followeeId);
          // 성공 시 그대로 유지
        } catch (e) {
          // 실패 시 롤백
          set({ followUser: prev });
          throw e;
        }
      },

      unfollowMember: async (followeeId: number) => {
        const followerId = get().user?.memberId ?? get().memberId;
        if (!followerId || followerId <= 0)
          throw new Error('로그인이 필요합니다.');

        const prev = get().followUser;
        if (!prev.includes(followeeId)) return; // 이미 언팔 상태

        // 낙관적 제거
        set({ followUser: prev.filter((id) => id !== followeeId) });

        try {
          // 서버 followId를 찾아서 삭제
          const followId = await findMemberFollowId(followerId, followeeId);
          if (followId) await deleteMemberFollow(followId);
        } catch (e) {
          // 실패 시 롤백
          set({ followUser: prev });
          throw e;
        }
      },

      // ===== 회사 팔로우/언팔 (낙관적 업데이트 + 실패 롤백) =====
      followCompanyAction: async (companyId: number) => {
        const followerId = get().user?.memberId ?? get().memberId;
        if (!followerId || followerId <= 0)
          throw new Error('로그인이 필요합니다.');

        const prev = get().followCompany;
        if (prev.includes(companyId)) return;

        // 낙관적 추가
        set({ followCompany: [...prev, companyId] });

        try {
          await createCompanyFollow(followerId, companyId);
        } catch (e) {
          // 실패 시 롤백
          set({ followCompany: prev });
          throw e;
        }
      },

      unfollowCompanyAction: async (companyId: number) => {
        const followerId = get().user?.memberId ?? get().memberId;
        if (!followerId || followerId <= 0)
          throw new Error('로그인이 필요합니다.');

        const prev = get().followCompany;
        if (!prev.includes(companyId)) return;

        // 낙관적 제거
        set({ followCompany: prev.filter((id) => id !== companyId) });

        try {
          const followId = await findCompanyFollowId(followerId, companyId);
          if (followId) await deleteCompanyFollow(followId);
        } catch (e) {
          // 실패 시 롤백
          set({ followCompany: prev });
          throw e;
        }
      },
    }),
    { name: 'userStateStorage' }
  )
);

// ✅ 브라우저 콘솔 디버깅용: 전역 노출 (개발 완료 후 삭제)
if (typeof window !== 'undefined') {
  (window as any).userStore = useUserStore;
}
