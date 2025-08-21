import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function usePostDetailActions(postData: any) {
  const navigate = useNavigate();

  // 공유 핸들러
  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다.');
    } catch (error) {
      console.error('링크 복사 실패:', error);
      alert('링크 복사에 실패했습니다.');
    }
  }, []);

  // 작성자 클릭 핸들러
  const handleAuthorClick = useCallback(() => {
    if (!postData) {
      alert('게시글 정보를 찾을 수 없습니다.');
      return;
    }
    
    if (postData.companyProfileUrl && postData.companyId) {
      navigate(`/company/${postData.companyId}`);
    } else if (postData.memberId) {
      navigate(`/member/${postData.memberId}`);
    } else {
      alert(postData.companyProfileUrl ? '회사 프로필 ID 정보가 없습니다.' : '개인 프로필 ID 정보가 없습니다.');
    }
  }, [postData, navigate]);

  // 삭제 핸들러
  const handleDelete = useCallback(async () => {
    if (!postData?.postId || !window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/post/${postData.postId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer accessToken' },
        body: JSON.stringify({})
      });

      if (response.ok && (await response.json()).status === 'SUCCESS') {
        alert('게시글이 삭제되었습니다.');
        setTimeout(() => navigate('/home'), 1500);
      } else {
        throw new Error('게시글 삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('❌ [PostDetailPage] 게시글 삭제 실패:', err);
      alert('게시글 삭제에 실패했습니다.');
    }
  }, [postData?.postId, navigate]);

  // 수정 핸들러
  const handleEdit = useCallback(() => {
    if (!postData) return;
    
    navigate(`/post/${postData.postId}/edit`, {
      state: {
        postData: {
          postId: postData.postId,
          link: postData.link,
          title: postData.title,
          content: postData.content,
          tags: postData.tags,
          thumbnailUrl: postData.thumbnailUrl
        }
      }
    });
  }, [postData, navigate]);

  return {
    handleShare,
    handleAuthorClick,
    handleDelete,
    handleEdit,
  };
}
