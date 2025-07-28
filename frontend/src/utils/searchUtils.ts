export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ko-KR');
};
 
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
}; 