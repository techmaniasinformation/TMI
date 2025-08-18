// 검색 관련 공통 유틸리티 함수들

// URL 파라미터에서 검색 조건 추출
export const extractSearchConditions = searchParams => {
  const keyword = searchParams.get('q') ?? searchParams.get('keyword') ?? '';
  const techTags = searchParams.get('techTags')?.split(',').filter(Boolean) ?? [];
  const companyTags = searchParams.get('companyTags')?.split(',').filter(Boolean) ?? [];
  const currentPage = parseInt(searchParams.get('page') ?? '1');
  return {
    keyword,
    techTags,
    companyTags,
    currentPage
  };
};

// 검색 조건이 있는지 확인
export const hasSearchConditions = (keyword, techTags, companyTags) => {
  const hasKeyword = keyword.trim() !== '';
  const hasTechTags = techTags.length > 0;
  const hasCompanyTags = companyTags.length > 0;
  return hasKeyword || hasTechTags || hasCompanyTags;
};

// 검색 파라미터 생성
export const createSearchParams = (keyword, techTags, companyTags, page = 1) => {
  const params = new URLSearchParams();
  if (keyword.trim()) {
    params.set('q', keyword.trim());
  }
  if (techTags.length > 0) {
    params.set('techTags', techTags.join(','));
  }
  if (companyTags.length > 0) {
    params.set('companyTags', companyTags.join(','));
  }
  params.set('page', page.toString());
  return params;
};

// 태그 제거 로직
export const removeTagFromParams = (searchParams, tagName, tagType, appliedFilters) => {
  const newSearchParams = new URLSearchParams(searchParams);
  const paramKey = tagType === 'tech' ? 'techTags' : 'companyTags';
  const currentTags = searchParams.get(paramKey)?.split(',').filter(Boolean) ?? [];
  const tagIndex = appliedFilters?.[`${tagType}Tags`]?.findIndex(t => t === tagName);
  if (tagIndex !== undefined && tagIndex >= 0) {
    const updatedTags = currentTags.filter((_, index) => index !== tagIndex);
    if (updatedTags.length > 0) {
      newSearchParams.set(paramKey, updatedTags.join(','));
    } else {
      newSearchParams.delete(paramKey);
    }
  }
  return newSearchParams;
};