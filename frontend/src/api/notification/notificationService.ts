import { apiClient } from '@/api/apiClient';

// 알림 관련 API 서비스 함수들
export const fetchNotifications = async () => {
  return apiClient.get('/notifications');
};

export const getNotifications = async () => {
  return apiClient.get('/notifications');
};

export const deleteNotification = async (notificationId: number) => {
  return apiClient.delete(`/notifications/${notificationId}`);
};

export const deleteAllNotifications = async () => {
  return apiClient.delete('/notifications');
};

export const markNotificationRead = async (notificationId: number) => {
  return apiClient.patch(`/notifications/${notificationId}/read`);
};

export const markNotificationAsRead = async (notificationId: number) => {
  return apiClient.patch(`/notifications/${notificationId}/read`);
};

export const markAllNotificationsRead = async () => {
  return apiClient.patch('/notifications/read-all');
};
