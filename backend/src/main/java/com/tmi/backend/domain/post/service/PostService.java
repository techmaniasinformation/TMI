package com.tmi.backend.domain.post.service;

import com.tmi.backend.domain.member.entity.Member;
import com.tmi.backend.domain.member.repository.MemberRepository;
import com.tmi.backend.domain.notification.event.PostCreatedEvent;
import com.tmi.backend.domain.post.dto.request.PostCreateRequest;
import com.tmi.backend.domain.post.dto.request.PostUpdateRequest;
import com.tmi.backend.domain.post.entity.Post;
import com.tmi.backend.domain.post.repository.PostRepository;
import com.tmi.backend.domain.postTag.service.PostTagService;
import com.tmi.backend.global.common.response.ServiceResult;
import com.tmi.backend.global.error.ErrorCode;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostService {

  private final MemberRepository memberRepository;
  private final PostRepository postRepository;
  private final PostTagService postTagService;
  private final ApplicationEventPublisher publisher;

  public record UpdatePostResult(Map<String, Long> responseMap, String oldThumbnailUrlToDelete) {
  }

  // TODO : 인증 로직 구현
  @Transactional
  public ServiceResult<Map<String, Long>> createPostWithUrl(
      PostCreateRequest postCreateRequest,
      String thumbnailUrl) {
    log.info("PostService : createPostWithUrl() 호출");
    Member member = memberRepository.findById(postCreateRequest.memberId()).orElse(null);
    if (member == null) {
      return ServiceResult.fail(ErrorCode.USER_NOT_FOUND);
    }

    Post post = Post.of(
        member,
        postCreateRequest.title(),
        postCreateRequest.link(),
        postCreateRequest.content(),
        thumbnailUrl);

    Post save = postRepository.save(post);

    postTagService.createPostTags(save, postCreateRequest.tags());

    publisher.publishEvent(new PostCreatedEvent(post.getId(), null, member.getId()));

    return ServiceResult.ok(Map.of("postId", save.getId()));
  }

  @Transactional
  public ServiceResult<UpdatePostResult> updatePostWithUrl(
      Long postId,
      PostUpdateRequest postUpdateRequest,
      String newThumbnailUrl,
      boolean isNewFileUpload) {
    log.info("PostService : updatePostWithUrl(" + postId + ") 호출");

    Post post = postRepository.findById(postId).orElse(null);
    if (post == null) {
      return ServiceResult.fail(ErrorCode.POST_NOT_FOUND);
    }

    String currentThumbnailUrl = post.getThumbnailUrl();
    String oldThumbnailUrlToDelete = null;

    // 1. 새로운 썸네일 파일이 업로드 된 경우: 기존 URL 교체 및 삭제 예약
    if (isNewFileUpload) {
      if (currentThumbnailUrl != null && !currentThumbnailUrl.isEmpty()) {
        oldThumbnailUrlToDelete = currentThumbnailUrl;
      }
    }
    // 2. 파일은 없지만 DTO에서 기존 썸네일을 지워달라고 비워서 요청한 경우
    else {
      String urlFromRequest = postUpdateRequest.thumbnailUrl();
      if ((urlFromRequest == null || urlFromRequest.isEmpty())
          && (currentThumbnailUrl != null && !currentThumbnailUrl.isEmpty())) {
        oldThumbnailUrlToDelete = currentThumbnailUrl;
        newThumbnailUrl = null; // DB값 비우기
      } else {
        // 둘 다 아니면 기존 썸네일 유지
        newThumbnailUrl = currentThumbnailUrl;
      }
    }

    post.updatePost(postUpdateRequest.title(), postUpdateRequest.content(),
        postUpdateRequest.link(), newThumbnailUrl);

    if (postUpdateRequest.tags() != null) {
      postTagService.updatePostTags(post, postUpdateRequest.tags());
    }

    return ServiceResult.ok(new UpdatePostResult(Map.of("postId", postId), oldThumbnailUrlToDelete));
  }

  @Transactional
  public ServiceResult<String> deletePostWithUrlReturn(Long postId) {
    log.info("PostService : deletePostWithUrlReturn(" + postId + ") 호출");

    Post post = postRepository.findById(postId).orElse(null);
    if (post == null) {
      return ServiceResult.fail(ErrorCode.POST_NOT_FOUND);
    }

    String thumbnailUrlToDelete = post.getThumbnailUrl();
    postRepository.delete(post);

    return ServiceResult.ok(thumbnailUrlToDelete);
  }
}
