import React from 'react';
import { useThemeStore } from '@/stores/themeStore';
import { usePostEdit } from '@/hooks/usePostEdit';
import PostEditHeader from '@/components/posts/PostEditHeader';
import PostEditForm from '@/components/posts/PostEditForm';
import PostEditThumbnail from '@/components/posts/PostEditThumbnail';
import PostEditContent from '@/components/posts/PostEditContent';
import PostEditTags from '@/components/posts/PostEditTags';
import PostEditActions from '@/components/posts/PostEditActions';

const PostEditPage: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  
  const {
    // 상태
    linkUrl,
    setLinkUrl,
    title,
    setTitle,
    content,
    setContent,
    tags,
    isLoading,
    isAILoading,
    aiSummary,
    urlError,
    aiError,
    titleError,
    contentError,
    newTag,
    showTagSuggestions,
    tagError,
    isPreviewMode,
    tagSuggestions,
    tagLoading,
    selectedImage,
    imagePreview,
    isImageProcessing,
    originalFileSize,

    // 이벤트 핸들러
    handleAISummary,
    handleSave,
    handleAddTag,
    handleTagInputChange,
    handleTagInputBlur,
    handleRemoveTag,
    handleTagKeyPress,
    handleTogglePreview,
    handleCancel,
    handleImageUpload,
    handleImageCancel,
  } = usePostEdit();

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <PostEditHeader />

        <div className="bg-light-header dark:bg-dark-header rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          {/* Form Fields */}
          <PostEditForm
            linkUrl={linkUrl}
            setLinkUrl={setLinkUrl}
            title={title}
            setTitle={setTitle}
            urlError={urlError}
            titleError={titleError}
          />

          {/* Thumbnail Image */}
          <PostEditThumbnail
            imagePreview={imagePreview}
            isImageProcessing={isImageProcessing}
            originalFileSize={originalFileSize}
            selectedImage={selectedImage}
            handleImageUpload={handleImageUpload}
            handleImageCancel={handleImageCancel}
          />

          {/* Content */}
          <PostEditContent
            content={content}
            setContent={setContent}
            isAILoading={isAILoading}
            aiError={aiError}
            isPreviewMode={isPreviewMode}
            contentError={contentError}
            isDarkMode={isDarkMode}
            handleAISummary={handleAISummary}
            handleTogglePreview={handleTogglePreview}
          />

          {/* Tags */}
          <PostEditTags
            isAILoading={isAILoading}
            newTag={newTag}
            showTagSuggestions={showTagSuggestions}
            tagError={tagError}
            tagLoading={tagLoading}
            tagSuggestions={tagSuggestions}
            tags={tags}
            handleTagInputChange={handleTagInputChange}
            handleTagKeyPress={handleTagKeyPress}
            handleTagInputBlur={handleTagInputBlur}
            handleAddTag={handleAddTag}
            handleRemoveTag={handleRemoveTag}
          />
        </div>

        {/* Action Buttons */}
        <PostEditActions
          isLoading={isLoading}
          handleCancel={handleCancel}
          handleSave={handleSave}
        />
      </div>
    </div>
  );
};

export default PostEditPage;
