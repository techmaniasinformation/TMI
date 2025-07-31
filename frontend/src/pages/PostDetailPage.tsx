import { useParams } from 'react-router-dom';
import { usePostDetail } from '@/hooks/posts/usePostDetail';

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { post, loading, error, formatDate, formatNumber } = usePostDetail(id || '');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-6"></div>
                <div className="h-32 bg-gray-200 rounded mb-6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                게시글을 찾을 수 없습니다
              </h1>
              <p className="text-gray-600 mb-6">
                {error || '요청하신 게시글이 존재하지 않습니다.'}
              </p>
              <button 
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-prime-btn text-white rounded-md hover:bg-prime-btn-hover transition-colors"
              >
                뒤로가기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 게시글 상세 컨텐츠 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                {post.title}
              </h1>
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center space-x-2">
                  <img
                    src={post.memberProfileUrl}
                    alt={post.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-gray-900">{post.name}</span>
                    {post.badgeUrl && (
                      <img
                        src={post.badgeUrl}
                        alt="badge"
                        className="w-4 h-4"
                      />
                    )}
                  </div>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-500">{formatDate(post.createAt)}</span>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-500">조회수 {formatNumber(post.viewCount)}</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {post.content}
                </div>
              </div>
            </div>

            {/* 태그 목록 */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 댓글 섹션 */}
            {post.comments && post.comments.length > 0 && (
              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  댓글 ({post.commentCount})
                </h3>
                <div className="space-y-4">
                  {post.comments.map((comment) => (
                    <div key={comment.commentId} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-start space-x-3">
                        <img
                          src={comment.memberProfileUrl}
                          alt={comment.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">{comment.name}</span>
                            {comment.badgeUrl && (
                              <img
                                src={comment.badgeUrl}
                                alt="badge"
                                className="w-4 h-4"
                              />
                            )}
                            <span className="text-sm text-gray-500">
                              {formatDate(comment.createAt)}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-2">{comment.comment}</p>
                          {comment.link && (
                            <a
                              href={comment.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              링크 보기
                            </a>
                          )}
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <button className="flex items-center space-x-1 hover:text-prime-btn">
                              <span>👍</span>
                              <span>{formatNumber(comment.recommendCount)}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-gray-600 hover:text-prime-btn">
                  <span>👍</span>
                  <span>좋아요 {formatNumber(post.starCount)}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-600 hover:text-prime-btn">
                  <span>💬</span>
                  <span>댓글 {formatNumber(post.commentCount)}</span>
                </button>
              </div>
              
              <button 
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                뒤로가기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
