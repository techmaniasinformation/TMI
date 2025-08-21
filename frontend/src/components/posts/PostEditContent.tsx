import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

interface PostEditContentProps {
  content: string;
  setContent: (content: string) => void;
  isAILoading: boolean;
  aiError: string;
  isPreviewMode: boolean;
  contentError: string;
  isDarkMode: boolean;
  handleAISummary: () => void;
  handleTogglePreview: () => void;
}

const PostEditContent: React.FC<PostEditContentProps> = ({
  content,
  setContent,
  isAILoading,
  aiError,
  isPreviewMode,
  contentError,
  isDarkMode,
  handleAISummary,
  handleTogglePreview,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          내용
        </label>
        <button
          type="button"
          onClick={handleAISummary}
          disabled={isAILoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-sm"
        >
          {isAILoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              AI 요약 중...
            </div>
          ) : (
            'AI 요약하기'
          )}
        </button>
      </div>
      
      {/* AI 에러 메시지 */}
      {aiError && (
        <div className="mb-3">
          <div className="text-red-600 dark:text-red-300 text-sm bg-red-50 dark:bg-red-900 border-l-4 border-red-400 dark:border-red-500 rounded-r-md px-4 py-3 relative shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-red-500 dark:text-red-400 text-lg flex-shrink-0">⚠️</span>
              <div className="flex-1">
                <p className="font-medium text-red-800 dark:text-red-100 mb-1">AI 요약 오류</p>
                <p className="text-red-700 dark:text-red-200">{aiError}</p>
                <p className="text-red-600 dark:text-red-300 text-xs mt-2 opacity-90">
                  💡 URL을 확인하고 다시 시도해주세요
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI 로딩 상태 */}
      {isAILoading ? (
        <div className="flex items-center justify-center h-64 border border-gray-300 dark:border-gray-600 rounded-md">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">AI가 내용을 분석하고 있습니다...</p>
          </div>
        </div>
      ) : (
        /* MD Editor (AI 요약 여부와 관계없이 동일) */
        <div data-color-mode={isDarkMode ? "dark" : "light"} className="md-editor-container h-[300px]">
          <MDEditor
            value={content}
            onChange={(val) => {
              const newContent = val || '';
              if (newContent.length <= 6000) {
                setContent(newContent);
              }
            }}
            preview={isPreviewMode ? "preview" : "edit"}
            hideToolbar={isPreviewMode}
            onClick={(e) => {
              // MDEditor 내부의 textarea를 찾아서 커서를 맨 뒤로 이동
              const editor = e.currentTarget;
              const textarea = editor.querySelector('textarea');
              if (textarea) {
                textarea.focus();
                textarea.setSelectionRange(textarea.value.length, textarea.value.length);
              }
            }}
          />
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {content.length > 6000 ? (
                <span className="text-red-500">글자 수 제한을 초과했습니다 ({content.length}/6000)</span>
              ) : (
                <span>{content.length}/6000</span>
              )}
            </div>
            <button
              type="button"
              onClick={handleTogglePreview}
              className="px-3 py-1 text-sm bg-gray-600 dark:bg-gray-700 text-white rounded-md hover:bg-gray-700 dark:hover:bg-gray-600"
            >
              {isPreviewMode ? '편집 모드' : '미리보기'}
            </button>
          </div>
          {contentError && (
            <p className="text-sm text-red-500 mt-1">{contentError}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PostEditContent;


