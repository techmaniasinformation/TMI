package com.tmi.backend.domain.post.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import com.tmi.backend.domain.member.entity.Member;
import com.tmi.backend.domain.member.repository.MemberRepository;
import com.tmi.backend.domain.post.dto.request.PostCreateRequest;
import com.tmi.backend.domain.post.dto.request.PostUpdateRequest;
import com.tmi.backend.domain.post.entity.Post;
import com.tmi.backend.domain.post.repository.PostRepository;
import com.tmi.backend.domain.post.service.PostService.UpdatePostResult;
import com.tmi.backend.domain.postTag.service.PostTagService;
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

@ExtendWith(MockitoExtension.class)
class PostServiceTest {

  @InjectMocks
  private PostService postService;

  @Mock
  private MemberRepository memberRepository;

  @Mock
  private PostRepository postRepository;

  @Mock
  private PostTagService postTagService;

  @Mock
  private ApplicationEventPublisher publisher;

  @Test
  @DisplayName("createPostWithUrl: 회원 정보 없을 시 에러를 반환해야 한다")
  void createPostWithUrl_memberNotFound() {
    // given
    PostCreateRequest request = mock(PostCreateRequest.class);
    String url = "url";
    given(request.memberId()).willReturn(999L);
    given(memberRepository.findById(999L)).willReturn(Optional.empty());

    // when
    ServiceResult<Map<String, Long>> result = postService.createPostWithUrl(request, url);

    // then
    assertThat(result.success()).isFalse();
    assertThat(result.code()).isEqualTo(ErrorCode.USER_NOT_FOUND);
    verify(postRepository, never()).save(any());
  }

  @Test
  @DisplayName("createPostWithUrl: 유효한 멤버와 URL로 저장에 성공해야 한다")
  void createPostWithUrl_success() {
    // given
    PostCreateRequest request = mock(PostCreateRequest.class);
    given(request.memberId()).willReturn(1L);
    given(request.title()).willReturn("title");
    given(request.content()).willReturn("content");
    given(request.link()).willReturn("link");
    String url = "http://s3.tmi.com/abc.jpg";

    Member member = mock(Member.class);
    given(member.getId()).willReturn(1L);
    given(memberRepository.findById(1L)).willReturn(Optional.of(member));

    Post savedPost = mock(Post.class);
    given(savedPost.getId()).willReturn(10L);
    given(postRepository.save(any(Post.class))).willReturn(savedPost);

    // when
    ServiceResult<Map<String, Long>> result = postService.createPostWithUrl(request, url);

    // then
    assertThat(result.success()).isTrue();
    assertThat(result.data().get("postId")).isEqualTo(10L);
    verify(postRepository).save(any(Post.class));
    verify(publisher).publishEvent(any());
  }

  @Test
  @DisplayName("updatePostWithUrl: 파일은 올라오지 않았으나, DTO에서 URL을 삭제해달라 요청할 경우 기존 URL을 식제대상(oldUrl)으로 반환해야 한다")
  void updatePostWithUrl_deleteExistingThumbnail() {
    // given
    Long postId = 1L;
    PostUpdateRequest request = mock(PostUpdateRequest.class);
    given(request.title()).willReturn("수정된 제목");
    given(request.content()).willReturn("수정된 내용");
    given(request.link()).willReturn("수정링크");
    given(request.thumbnailUrl()).willReturn(""); // URL 이 비어있으면 삭제 의지

    Post post = mock(Post.class);
    given(post.getThumbnailUrl()).willReturn("기존_URL");
    given(postRepository.findById(postId)).willReturn(Optional.of(post));

    // when
    ServiceResult<UpdatePostResult> result = postService.updatePostWithUrl(postId, request, null, false);

    // then
    assertThat(result.success()).isTrue();
    assertThat(result.data().oldThumbnailUrlToDelete()).isEqualTo("기존_URL");
    verify(post).updatePost("수정된 제목", "수정된 내용", "수정링크", null); // 삭제 되었으므로 null 전달
  }

  @Test
  @DisplayName("deletePostWithUrlReturn: 게시글 정상 삭제 시, 기존에 등록돼있던 이미지 URL을 반환해야 한다")
  void deletePostWithUrlReturn_success() {
    // given
    Long postId = 1L;
    Post post = mock(Post.class);
    given(post.getThumbnailUrl()).willReturn("기존_URL");
    given(postRepository.findById(postId)).willReturn(Optional.of(post));

    // when
    ServiceResult<String> result = postService.deletePostWithUrlReturn(postId);

    // then
    assertThat(result.success()).isTrue();
    assertThat(result.data()).isEqualTo("기존_URL");
    verify(postRepository).delete(post);
  }

  @Test
  @DisplayName("deletePostWithUrlReturn: 없는 게시물 삭제 시도시 실패를 반환한다")
  void deletePostWithUrlReturn_notFound() {
    // given
    Long postId = 999L;
    given(postRepository.findById(postId)).willReturn(Optional.empty());

    // when
    ServiceResult<String> result = postService.deletePostWithUrlReturn(postId);

    // then
    assertThat(result.success()).isFalse();
    assertThat(result.code()).isEqualTo(ErrorCode.POST_NOT_FOUND);
    verify(postRepository, never()).delete(any());
  }
}
