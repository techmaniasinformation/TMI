import React from 'react';
import { useTheme } from '@/hooks/store/useStoreActions';
import { usePostCreate } from '@/hooks/usePostCreate';
import PostCreateHeader from '@/components/posts/PostCreateHeader';
import PostCreateForm from '@/components/posts/PostCreateForm';
import PostCreateThumbnail from '@/components/posts/PostCreateThumbnail';
import PostCreateContent from '@/components/posts/PostCreateContent';
import PostCreateTags from '@/components/posts/PostCreateTags';
import PostCreateActions from '@/components/posts/PostCreateActions';

const PostCreatePage: React.FC = () => {
  const { isDarkMode } = useTheme();
  
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
  } = usePostCreate();

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <PostCreateHeader />

        <div className="bg-light-header dark:bg-dark-header rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          {/* Form Fields */}
          <PostCreateForm
            linkUrl={linkUrl}
            setLinkUrl={setLinkUrl}
            title={title}
            setTitle={setTitle}
            urlError={urlError}
            titleError={titleError}
          />

          {/* Thumbnail Image */}
          <PostCreateThumbnail
            imagePreview={imagePreview}
            isImageProcessing={isImageProcessing}
            originalFileSize={originalFileSize}
            selectedImage={selectedImage}
            handleImageUpload={handleImageUpload}
            handleImageCancel={handleImageCancel}
          />

          {/* Content */}
          <PostCreateContent
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
          <PostCreateTags
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
        <PostCreateActions
          isLoading={isLoading}
          handleCancel={handleCancel}
          handleSave={handleSave}
        />
      </div>
    </div>
  );
};

export default PostCreatePage; 