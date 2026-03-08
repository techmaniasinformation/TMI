package com.tmi.backend.domain.comment.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import com.tmi.backend.domain.comment.dto.request.CommentRequest;
import com.tmi.backend.domain.comment.entity.Comment;
import com.tmi.backend.domain.comment.repository.CommentRepository;
import com.tmi.backend.domain.member.entity.Member;
import com.tmi.backend.domain.member.repository.MemberRepository;
import com.tmi.backend.domain.post.entity.Post;
import com.tmi.backend.domain.post.repository.PostRepository;
import com.tmi.backend.global.common.response.ServiceResult;
import com.tmi.backend.global.error.ErrorCode;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.dao.EmptyResultDataAccessException;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

  @InjectMocks
  private CommentService commentService;

  @Mock
  private CommentRepository commentRepository;

  @Mock
  private MemberRepository memberRepository;

  @Mock
  private PostRepository postRepository;

  @Mock
  private ApplicationEventPublisher publisher;

  @Test
  @DisplayName("register: 정상 댓글 등록")
  void register_success() {
    // given
    CommentRequest request = mock(CommentRequest.class);
    given(request.memberId()).willReturn(1L);
    given(request.postId()).willReturn(1L);
    given(request.comment()).willReturn("테스트 댓글");
    given(request.link()).willReturn("http://link.com");

    Member member = mock(Member.class);
    given(member.getId()).willReturn(1L);

    Post post = mock(Post.class);
    given(post.getId()).willReturn(1L);
    given(post.getMember()).willReturn(member);

    Comment comment = mock(Comment.class);
    given(comment.getId()).willReturn(100L);

    given(memberRepository.findById(1L)).willReturn(Optional.of(member));
    given(postRepository.findById(1L)).willReturn(Optional.of(post));
    given(commentRepository.save(any(Comment.class))).willReturn(comment);

    // when
    ServiceResult<Map<String, Long>> result = commentService.register(request);

    // then
    assertThat(result.success()).isTrue();
    assertThat(result.data().get("commentId")).isEqualTo(100L);
    verify(publisher).publishEvent(any());
  }

  @Test
  @DisplayName("register: 회원이 존재하지 않을 경우 에러를 반환해야 한다. (경계 케이스)")
  void register_fail_memberNotFound() {
    // given
    CommentRequest request = mock(CommentRequest.class);
    given(request.memberId()).willReturn(999L);

    given(memberRepository.findById(999L)).willReturn(Optional.empty());

    // when
    ServiceResult<Map<String, Long>> result = commentService.register(request);

    // then
    assertThat(result.success()).isFalse();
    assertThat(result.code()).isEqualTo(ErrorCode.USER_NOT_FOUND);
    verify(commentRepository, never()).save(any());
  }

  @Test
  @DisplayName("register: 게시물이 존재하지 않을 경우 에러를 반환해야 한다. (경계 케이스)")
  void register_fail_postNotFound() {
    // given
    CommentRequest request = mock(CommentRequest.class);
    given(request.memberId()).willReturn(1L);
    given(request.postId()).willReturn(999L);

    Member member = mock(Member.class);
    given(memberRepository.findById(1L)).willReturn(Optional.of(member));
    given(postRepository.findById(999L)).willReturn(Optional.empty());

    // when
    ServiceResult<Map<String, Long>> result = commentService.register(request);

    // then
    assertThat(result.success()).isFalse();
    assertThat(result.code()).isEqualTo(ErrorCode.POST_NOT_FOUND);
    verify(commentRepository, never()).save(any());
  }

  @Test
  @DisplayName("delete: 정상 삭제")
  void delete_success() {
    // given
    Long commentId = 1L;

    // when
    ServiceResult<Void> result = commentService.delete(commentId);

    // then
    assertThat(result.success()).isTrue();
    verify(commentRepository).deleteById(commentId);
  }

  @Test
  @DisplayName("delete: 없는 댓글 삭제 시도시 에러를 반환한다. (경계 케이스)")
  void delete_fail_EmptyResult() {
    // given
    willThrow(new EmptyResultDataAccessException(1)).given(commentRepository).deleteById(999L);

    // when
    ServiceResult<Void> result = commentService.delete(999L);

    // then
    assertThat(result.success()).isFalse();
    assertThat(result.code()).isEqualTo(ErrorCode.COMMENT_NOT_FOUND);
  }
}
