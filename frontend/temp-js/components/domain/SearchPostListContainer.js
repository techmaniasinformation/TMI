import { useSearchParams } from 'react-router-dom';
import SearchResultBar from './search/SearchResultBar';
import SearchPostList from './search/SearchPostList';
import ServerPagination from './ServerPagination';
import { extractSearchConditions, removeTagFromParams } from '@/utils/searchUtils';
import { SearchResultSkeleton } from '@/components/foundation/Skeleton';
import { ErrorState, DefaultErrorActions } from '@/components/foundation/ErrorState';
import { EmptyState, SearchTips, NoResultsTips } from '@/components/foundation/EmptyState';
export default function SearchPostListContainer({
  posts,
  loading,
  error,
  currentPage,
  totalCount,
  appliedFilters,
  onPageChange,
  onPostClick,
  searchState,
  hasSearchConditions
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL 파라미터에서 검색 조건 추출
  const {
    keyword,
    techTags,
    companyTags
  } = extractSearchConditions(searchParams);

  // 키워드 제거
  const handleRemoveKeyword = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('q');
    newSearchParams.delete('keyword');
    setSearchParams(newSearchParams);
  };

  // 기술 태그 제거
  const handleRemoveTechTag = tagName => {
    const newSearchParams = removeTagFromParams(searchParams, tagName, 'tech', appliedFilters);
    setSearchParams(newSearchParams);
  };

  // 회사 태그 제거
  const handleRemoveCompanyTag = companyName => {
    const newSearchParams = removeTagFromParams(searchParams, companyName, 'company', appliedFilters);
    setSearchParams(newSearchParams);
  };

  // 상태별 렌더링
  switch (searchState) {
    case 'idle':
      return /*#__PURE__*/React.createElement(EmptyState, {
        title: "\uAC80\uC0C9 \uC870\uAC74\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694",
        description: "\uD0A4\uC6CC\uB4DC\uB97C \uC785\uB825\uD558\uAC70\uB098 \uD0DC\uADF8\uB97C \uC120\uD0DD\uD558\uC5EC \uAC80\uC0C9\uC744 \uC2DC\uC791\uD558\uC138\uC694",
        tips: /*#__PURE__*/React.createElement(SearchTips, null)
      });
    case 'loading':
      return /*#__PURE__*/React.createElement(SearchResultSkeleton, null);
    case 'error':
      return /*#__PURE__*/React.createElement(ErrorState, {
        title: "\uAC80\uC0C9 \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4",
        message: error || undefined,
        actions: /*#__PURE__*/React.createElement(DefaultErrorActions, null)
      });
    case 'no-results':
      return /*#__PURE__*/React.createElement("div", {
        className: "w-full max-w-4xl mx-auto bg-light-bg dark:bg-dark-bg"
      }, hasSearchConditions && /*#__PURE__*/React.createElement(SearchResultBar, {
        totalCount: totalCount,
        appliedFilters: appliedFilters || {
          q: keyword,
          techTags: techTags,
          companyTags: companyTags
        },
        onRemoveKeyword: handleRemoveKeyword,
        onRemoveTechTag: handleRemoveTechTag,
        onRemoveCompanyTag: handleRemoveCompanyTag
      }), /*#__PURE__*/React.createElement(EmptyState, {
        title: "\uAC80\uC0C9 \uACB0\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4",
        description: `"${keyword || '선택된 태그'}"에 대한 검색 결과를 찾을 수 없습니다`,
        tips: /*#__PURE__*/React.createElement(NoResultsTips, {
          keyword: keyword
        })
      }));
    case 'success':
      return /*#__PURE__*/React.createElement("div", {
        className: "w-full max-w-4xl mx-auto bg-light-bg dark:bg-dark-bg"
      }, hasSearchConditions && /*#__PURE__*/React.createElement(SearchResultBar, {
        totalCount: totalCount,
        appliedFilters: appliedFilters || {
          q: keyword,
          techTags: techTags,
          companyTags: companyTags
        },
        onRemoveKeyword: handleRemoveKeyword,
        onRemoveTechTag: handleRemoveTechTag,
        onRemoveCompanyTag: handleRemoveCompanyTag
      }), /*#__PURE__*/React.createElement(SearchPostList, {
        posts: posts,
        loading: loading,
        error: error,
        totalCount: totalCount,
        onPostClick: onPostClick,
        searchKeyword: appliedFilters?.q ?? keyword,
        searchTechTags: appliedFilters?.techTags ?? [],
        searchCompanyTags: appliedFilters?.companyTags ?? []
      }), hasSearchConditions && totalCount > 0 && /*#__PURE__*/React.createElement(ServerPagination, {
        currentPage: currentPage,
        totalCount: totalCount,
        pageSize: 10,
        onPageChange: onPageChange
      }));
    default:
      return /*#__PURE__*/React.createElement(SearchResultSkeleton, null);
  }
}
;