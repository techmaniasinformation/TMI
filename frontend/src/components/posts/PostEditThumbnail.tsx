import React from 'react';

interface PostEditThumbnailProps {
  imagePreview: string;
  isImageProcessing: boolean;
  originalFileSize: number;
  selectedImage: File | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageCancel: () => void;
}

const PostEditThumbnail: React.FC<PostEditThumbnailProps> = ({
  imagePreview,
  isImageProcessing,
  originalFileSize,
  selectedImage,
  handleImageUpload,
  handleImageCancel,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
        썸네일 이미지
      </label>
      
      {/* Image Display Area */}
      <div className="w-48 h-32 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 mb-3 overflow-hidden">
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="업로드된 이미지"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">디폴트 이미지</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Image Upload */}
      <div className="flex items-center gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
          disabled={isImageProcessing}
        />
        <label
          htmlFor="image-upload"
          className={`px-4 py-2 text-white rounded-md cursor-pointer text-sm ${
            isImageProcessing 
              ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isImageProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              처리 중...
            </div>
          ) : (
            imagePreview ? '이미지 변경' : '이미지 업로드'
          )}
        </label>
        {imagePreview && !isImageProcessing && (
          <button
            type="button"
            onClick={handleImageCancel}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer text-sm"
          >
            이미지 취소
          </button>
        )}
        {selectedImage && (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)}MB)
            {originalFileSize > selectedImage.size && (
              <span className="text-gray-400 dark:text-gray-500 ml-1">
                (원본: {(originalFileSize / 1024 / 1024).toFixed(2)}MB)
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default PostEditThumbnail;

