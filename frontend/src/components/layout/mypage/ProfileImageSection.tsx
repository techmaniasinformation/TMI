import React from 'react';
import { Camera } from 'lucide-react';
import { getSafeProfileUrl, handleProfileImageError } from '@/utils/defaultImages';
import { useThemeStore } from '@/stores/themeStore';

interface ProfileImageSectionProps {
  imagePreview: string;
  existingImageUrl: string;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageRemove: () => void;
}

const ProfileImageSection: React.FC<ProfileImageSectionProps> = ({
  imagePreview,
  existingImageUrl,
  handleImageUpload,
  handleImageRemove,
}) => {
  const { isDarkMode } = useThemeStore();

  return (
    <div className="flex flex-col items-center justify-center mt-4 mb-2">
      <div
        className={`relative w-24 h-24 rounded-full border overflow-hidden flex items-center justify-center ${
          isDarkMode ? 'border-gray-600' : 'border-gray-300'
        }`}
      >
        {imagePreview || existingImageUrl ? (
          <img
            src={getSafeProfileUrl(imagePreview || existingImageUrl)}
            alt="Profile"
            className="w-24 h-24 object-cover"
            draggable={false}
            onError={handleProfileImageError}
          />
        ) : (
          <img
            src={getSafeProfileUrl(null)}
            alt="Profile"
            className="w-24 h-24 object-cover"
            draggable={false}
            onError={handleProfileImageError}
          />
        )}
        <label
          htmlFor="image-upload"
          className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition cursor-pointer"
        >
          <Camera className="w-6 h-6 text-white" />
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      {(imagePreview || existingImageUrl) && (
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            className={`text-xs underline ${
              isDarkMode ? 'text-red-400' : 'text-red-600'
            }`}
            onClick={handleImageRemove}
          >
            이미지 제거
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileImageSection;

