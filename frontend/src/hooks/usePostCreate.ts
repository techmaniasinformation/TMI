import { usePostCreateState } from './posts/usePostCreateState';
import { usePostCreateActions } from './posts/usePostCreateActions';

// 게시글 생성 훅
export const usePostCreate = () => {
  const state = usePostCreateState();
  const actions = usePostCreateActions(state);

  return {
    // 상태
    linkUrl: state.linkUrl,
    setLinkUrl: state.setLinkUrl,
    title: state.title,
    setTitle: state.setTitle,
    content: state.content,
    setContent: state.setContent,
    tags: state.tags,
    isLoading: state.isLoading,
    isAILoading: state.isAILoading,
    aiSummary: state.aiSummary,
    urlError: state.urlError,
    aiError: state.aiError,
    titleError: state.titleError,
    contentError: state.contentError,
    newTag: state.newTag,
    showTagSuggestions: state.showTagSuggestions,
    tagError: state.tagError,
    isPreviewMode: state.isPreviewMode,
    selectedImage: state.selectedImage,
    imagePreview: state.imagePreview,
    isImageProcessing: state.isImageProcessing,
    originalFileSize: state.originalFileSize,

    // 태그 자동완성
    tagSuggestions: actions.suggestions,
    tagLoading: actions.loading,

    // 이벤트 핸들러
    handleAISummary: actions.handleAISummary,
    handleSave: actions.handleSave,
    handleAddTag: actions.handleAddTag,
    handleTagInputChange: actions.handleTagInputChange,
    handleTagInputBlur: actions.handleTagInputBlur,
    handleRemoveTag: state.removeTag,
    handleTagKeyPress: actions.handleTagKeyPress,
    handleTogglePreview: state.togglePreview,
    handleCancel: actions.handleCancel,
    handleImageUpload: state.handleImageUpload,
    handleImageCancel: state.handleImageCancel,

    // 유틸리티
    clearSuggestions: actions.clearSuggestions,
  };
};

