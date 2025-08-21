import React, { memo } from 'react';
import { Loader2, AlertTriangle, CheckCircle, Info, RefreshCw } from 'lucide-react';

// ===== 통합 Status Props =====
interface StatusProps {
  type: 'loading' | 'error' | 'empty';
  // 공통 props
  className?: string;
  // loading type props
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'skeleton';
  // error type props
  title?: string;
  onRetry?: () => void;
  errorVariant?: 'error' | 'warning' | 'info';
  // empty type props
  emptyTitle?: string;
  emptyMessage?: string;
  icon?: string;
  action?: React.ReactNode;
}

// ===== 통합 Status 컴포넌트 =====
export const Status = memo(function Status({
  type,
  // 공통 props
  className = '',
  // loading type props
  message = '로딩 중...',
  size = 'md',
  variant = 'spinner',
  // error type props
  title,
  onRetry,
  errorVariant = 'error',
  // empty type props
  emptyTitle,
  emptyMessage,
  icon,
  action,
}: StatusProps) {
  const sizeClasses = {
    sm: {
      container: 'p-4',
      icon: 'w-6 h-6',
      text: 'text-sm',
      title: 'text-base',
    },
    md: {
      container: 'p-6',
      icon: 'w-8 h-8',
      text: 'text-base',
      title: 'text-lg',
    },
    lg: {
      container: 'p-8',
      icon: 'w-12 h-12',
      text: 'text-lg',
      title: 'text-xl',
    },
  };

  const classes = sizeClasses[size];

  const renderLoading = () => {
    const iconClasses = `${classes.icon} animate-spin text-blue-600`;
    
    return (
      <div className={`flex flex-col items-center justify-center ${classes.container} ${className}`}>
        {variant === 'spinner' && <Loader2 className={iconClasses} />}
        {variant === 'dots' && (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )}
        {variant === 'skeleton' && (
          <div className="space-y-2 w-full max-w-xs">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        )}
        <p className={`mt-4 text-gray-600 dark:text-gray-400 ${classes.text}`}>
          {message}
        </p>
      </div>
    );
  };

  const renderError = () => {
    const errorIconClasses = {
      error: 'text-red-600',
      warning: 'text-yellow-600',
      info: 'text-blue-600',
    };

    const IconComponent = {
      error: AlertTriangle,
      warning: AlertTriangle,
      info: Info,
    }[errorVariant];

    return (
      <div className={`flex flex-col items-center justify-center ${classes.container} ${className}`}>
        <IconComponent className={`${classes.icon} ${errorIconClasses[errorVariant]}`} />
        {title && (
          <h3 className={`mt-4 font-semibold text-gray-900 dark:text-white ${classes.title}`}>
            {title}
          </h3>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCw className="w-4 h-4" />
            <span>다시 시도</span>
          </button>
        )}
      </div>
    );
  };

  const renderEmpty = () => {
    return (
      <div className={`flex flex-col items-center justify-center ${classes.container} ${className}`}>
        {icon && (
          <div className={`${classes.icon} text-gray-400 mb-4`}>
            {icon}
          </div>
        )}
        {emptyTitle && (
          <h3 className={`font-semibold text-gray-900 dark:text-white ${classes.title}`}>
            {emptyTitle}
          </h3>
        )}
        {emptyMessage && (
          <p className={`mt-2 text-gray-600 dark:text-gray-400 ${classes.text}`}>
            {emptyMessage}
          </p>
        )}
        {action && (
          <div className="mt-4">
            {action}
          </div>
        )}
      </div>
    );
  };

  switch (type) {
    case 'loading':
      return renderLoading();
    case 'error':
      return renderError();
    case 'empty':
      return renderEmpty();
    default:
      return null;
  }
});

// ===== 편의 함수들 (기존 API 호환성) =====

// 로딩 상태 컴포넌트
export const Loading = memo(function Loading({
  message = '로딩 중...',
  size = 'md',
  variant = 'spinner',
  className,
}: {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'skeleton';
  className?: string;
}) {
  return (
    <Status
      type="loading"
      message={message}
      size={size}
      variant={variant}
      className={className}
    />
  );
});

// 에러 상태 컴포넌트
export const Error = memo(function Error({
  title,
  onRetry,
  errorVariant = 'error',
  className,
}: {
  title?: string;
  onRetry?: () => void;
  errorVariant?: 'error' | 'warning' | 'info';
  className?: string;
}) {
  return (
    <Status
      type="error"
      title={title}
      onRetry={onRetry}
      errorVariant={errorVariant}
      className={className}
    />
  );
});

// 빈 상태 컴포넌트
export const Empty = memo(function Empty({
  emptyTitle,
  emptyMessage,
  icon,
  action,
  className,
}: {
  emptyTitle?: string;
  emptyMessage?: string;
  icon?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <Status
      type="empty"
      emptyTitle={emptyTitle}
      emptyMessage={emptyMessage}
      icon={icon}
      action={action}
      className={className}
    />
  );
});

// ===== 상태 컨테이너 컴포넌트 =====
interface StatusContainerProps {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const StatusContainer = memo(function StatusContainer({
  loading = false,
  error = null,
  empty = false,
  emptyMessage = '데이터가 없습니다.',
  onRetry,
  children,
  className = '',
}: StatusContainerProps) {
  if (loading) {
    return <Loading className={className} />;
  }

  if (error) {
    return (
      <Error
        title={error}
        onRetry={onRetry}
        className={className}
      />
    );
  }

  if (empty) {
    return (
      <Empty
        emptyMessage={emptyMessage}
        className={className}
      />
    );
  }

  return <>{children}</>;
});
