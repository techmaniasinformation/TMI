import React from 'react';
import Tag from '../article/Tag';
export default function SearchResultBar({
  totalCount,
  appliedFilters,
  onRemoveKeyword,
  onRemoveTechTag,
  onRemoveCompanyTag
}) {
  if (!appliedFilters) {
    return null;
  }
  const hasFilters = appliedFilters.q || appliedFilters.techTags && appliedFilters.techTags.length > 0 || appliedFilters.companyTags && appliedFilters.companyTags.length > 0;
  if (!hasFilters) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "mb-6"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-bold text-gray-900 dark:text-white mb-4"
  }, "\uAC80\uC0C9 \uACB0\uACFC (", totalCount, "\uAC1C)"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2 mb-4"
  }, appliedFilters.q && /*#__PURE__*/React.createElement(Tag, {
    tag: `키워드: ${appliedFilters.q}`,
    variant: "search",
    removable: true,
    onRemove: onRemoveKeyword
  }), appliedFilters.techTags?.map((tag, index) => /*#__PURE__*/React.createElement(Tag, {
    key: index,
    tag: tag,
    variant: "tech",
    removable: true,
    onRemove: () => onRemoveTechTag(tag)
  })), appliedFilters.companyTags?.map((company, index) => /*#__PURE__*/React.createElement(Tag, {
    key: index,
    tag: company,
    variant: "company",
    removable: true,
    onRemove: () => onRemoveCompanyTag(company)
  }))));
}