import React, { memo } from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

// ===== 통합 Modal Props =====
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant: 'confirm' | 'complete' | 'custom';
  // 공통 props
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  // confirm variant props
  onConfirm?: () => void | Promise<void>;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  errorMessage?: string;
  variantColor?: 'danger' | 'warning' | 'info';
  // complete variant props
  buttonText?: string;
  completeColor?: 'success' | 'info' | 'warning';
  // custom variant props
  children?: React.ReactNode;
}

// ===== 통합 Modal 컴포넌트 =====
export const Modal = memo(function Modal({
  isOpen,
  onClose,
  variant,
  // 공통 props
  title,
  message,
  icon,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
  // confirm variant props
  onConfirm,
  confirmText = '확인',
  cancelText = '취소',
  loading = false,
  errorMessage,
  variantColor = 'info',
  // complete variant props
  buttonText = '확인',
  completeColor = 'success',
  // custom variant props
  children,
}: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  const variantColorClasses = {
    danger: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
  };

  const completeColorClasses = {
    success: 'text-green-600',
    info: 'text-blue-600',
    warning: 'text-yellow-600',
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
    onClose();
  };

  const renderIcon = () => {
    if (icon) return icon;

    if (variant === 'confirm') {
      const IconComponent = {
        danger: AlertTriangle,
        warning: AlertTriangle,
        info: Info,
      }[variantColor];
      return <IconComponent className={`w-8 h-8 ${variantColorClasses[variantColor]}`} />;
    }

    if (variant === 'complete') {
      const IconComponent = {
        success: CheckCircle,
        info: Info,
        warning: AlertTriangle,
      }[completeColor];
      return <IconComponent className={`w-8 h-8 ${completeColorClasses[completeColor]}`} />;
    }

    return null;
  };

  const renderContent = () => {
    if (variant === 'custom') {
      return children;
    }

    return (
      <div className="text-center">
        {renderIcon()}
        {title && (
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        )}
        {message && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {message}
          </p>
        )}
        {errorMessage && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {errorMessage}
          </p>
        )}
      </div>
    );
  };

  const renderActions = () => {
    if (variant === 'custom') return null;

    if (variant === 'confirm') {
      return (
        <div className="mt-6 flex justify-center space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? '처리 중...' : confirmText}
          </button>
        </div>
      );
    }

    if (variant === 'complete') {
      return (
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {buttonText}
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div className={`relative w-full ${sizeClasses[size]} bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6`}>
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        
        {renderContent()}
        {renderActions()}
      </div>
    </div>
  );
});

// ===== 편의 함수들 (기존 API 호환성) =====

// 회원탈퇴 확인 모달
export const WithdrawalConfirmModal = memo(function WithdrawalConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  errorMessage,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
  errorMessage?: string;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant="confirm"
      title="회원탈퇴"
      message="정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      confirmText="탈퇴"
      cancelText="취소"
      loading={loading}
      errorMessage={errorMessage}
      variantColor="danger"
    />
  );
});

// 회원탈퇴 완료 모달
export const WithdrawalCompleteModal = memo(function WithdrawalCompleteModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant="complete"
      title="회원탈퇴 완료"
      message="회원탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다."
      buttonText="확인"
      completeColor="success"
    />
  );
});

// 기본 모달 (내부 함수)
function BaseModal({ isOpen, onClose, children }: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant="custom"
    >
      {children}
    </Modal>
  );
}

export { BaseModal };
