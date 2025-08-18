import React from 'react';

interface PostCreateFormProps {
  linkUrl: string;
  setLinkUrl: (url: string) => void;
  title: string;
  setTitle: (title: string) => void;
  urlError: string;
  titleError: string;
}

const PostCreateForm: React.FC<PostCreateFormProps> = ({
  linkUrl,
  setLinkUrl,
  title,
  setTitle,
  urlError,
  titleError,
}) => {
  return (
    <>
      {/* Link URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          링크 URL *
        </label>
        <div className="relative">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            maxLength={255}
            placeholder="https://example.com"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          />
          <span className="absolute right-3 top-2 text-sm text-gray-500 dark:text-gray-400">
            {linkUrl.length}/255
          </span>
        </div>
        {/* URL 관련 경고 메시지 */}
        {urlError && (
          <p className="text-sm text-red-500 dark:text-red-400 mt-1">{urlError}</p>
        )}
        {!linkUrl && (
          <p className="text-sm text-red-500 dark:text-red-400 mt-1">⚠️ 링크 URL을 입력해주세요</p>
        )}
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          제목 *
        </label>
        <div className="relative">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={20}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent break-words break-all dark:bg-gray-800 dark:text-white"
          />
          <span className="absolute right-3 top-2 text-sm text-gray-500 dark:text-gray-400">
            {title.length}/20
          </span>
        </div>
        {titleError && (
          <p className="text-sm text-red-500 dark:text-red-400 mt-1">{titleError}</p>
        )}
      </div>
    </>
  );
};

export default PostCreateForm;
