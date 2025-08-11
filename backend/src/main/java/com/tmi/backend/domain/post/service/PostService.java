package com.tmi.backend.domain.post.service;

import com.tmi.backend.domain.member.entity.Member;
import com.tmi.backend.domain.member.entity.Provider;
import com.tmi.backend.domain.member.repository.MemberRepository;
import com.tmi.backend.domain.notification.event.PostCreatedEvent;
import com.tmi.backend.domain.post.dto.request.PostCreateRequest;
import com.tmi.backend.domain.post.dto.request.PostUpdateRequest;
import com.tmi.backend.domain.post.entity.Post;
import com.tmi.backend.domain.post.repository.PostRepository;
import com.tmi.backend.domain.postTag.service.PostTagService;
import com.tmi.backend.global.Utils.FileUtil;
import com.tmi.backend.global.common.response.ServiceResult;
import com.tmi.backend.global.error.ErrorCode;
import java.io.IOException;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostService {

  private final MemberRepository memberRepository;
  private final PostRepository postRepository;
  private final PostTagService postTagService;
  private final FileUtil fileUtil;
  private final ApplicationEventPublisher publisher;

  @Transactional
  public ServiceResult<Map<String, Long>> createPost(
      PostCreateRequest postCreateRequest,
      MultipartFile thumbnailImage,
      Long userDetailId
  ) {
    log.info("PostService : createPost() 호출");

    Member member = memberRepository.findById(postCreateRequest.memberId()).orElse(null);
    if (member == null) {
      return ServiceResult.fail(ErrorCode.USER_NOT_FOUND);
    }

    Member user = memberRepository.findById(userDetailId).orElse(null);
    if (user == null || (!userDetailId.equals(member.getId()) && user.getProvider() != Provider.ADMIN)) {
      return ServiceResult.fail(ErrorCode.AUTH_ACCESS_DENIED);
    }

    String thumbnailUrl = null;
    if (thumbnailImage != null && !thumbnailImage.isEmpty()) {
      try {
        thumbnailUrl = fileUtil.saveFile(thumbnailImage, "post");

        final String finalThumbnailUrl = thumbnailUrl;
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
          @Override
          public void afterCompletion(int status) {
            if (status == STATUS_ROLLED_BACK) {
              try {
                fileUtil.deleteFile(finalThumbnailUrl, "post");
              } catch (IOException e) {
                log.error("게시글 썸네일 롤백 중 파일 삭제 실패", e);
              }
            }
          }
        });
      } catch (IOException e) {
        log.error("썸네일 이미지 파일 저장 실패", e);
        return ServiceResult.fail(ErrorCode.FILE_UPLOAD_ERROR); // 예시 에러 코드
      }
    }

    Post post = Post.of(
        member,
        postCreateRequest.title(),
        postCreateRequest.link(),
        postCreateRequest.content(),
        thumbnailUrl
    );

    Post save = postRepository.save(post);

    postTagService.createPostTags(save, postCreateRequest.tags());

    publisher.publishEvent(new PostCreatedEvent(save.getId(), null, member.getId()));

    return ServiceResult.ok(Map.of("postId", save.getId()));
  }

  @Transactional
  public ServiceResult<Map<String, Long>> updatePost(
      Long postId,
      PostUpdateRequest postUpdateRequest,
      MultipartFile thumbnailImage,
      Long userDetailId) {
    log.info("PostService : updatePost(" + postId + ") 호출");

    Post post = postRepository.findById(postId).orElse(null);
    if (post == null) {
      return ServiceResult.fail(ErrorCode.POST_NOT_FOUND);
    }

    Member user = memberRepository.findById(userDetailId).orElse(null);
    if (user == null || (!userDetailId.equals(post.getMember().getId()) && user.getProvider() != Provider.ADMIN)) {
      return ServiceResult.fail(ErrorCode.AUTH_ACCESS_DENIED);
    }

    String newThumbnailUrl = post.getThumbnailUrl();

    // 새로운 썸네일 이미지가 업로드된 경우
    if (thumbnailImage != null && !thumbnailImage.isEmpty()) {
      // 기존 썸네일이 있었다면 EC2에서 먼저 삭제
      if (newThumbnailUrl != null && !newThumbnailUrl.isEmpty()) {
        try {
          fileUtil.deleteFile(newThumbnailUrl, "post");
        } catch (IOException e) {
          log.error("기존 게시글 썸네일 삭제 실패: {}", newThumbnailUrl, e);
        }
      }

      // 새 파일 저장 및 롤백 처리 로직
      try {
        newThumbnailUrl = fileUtil.saveFile(thumbnailImage, "post");
        // 트랜잭션 롤백 시 파일 삭제를 위한 동기화 작업 등록
        final String urlToDeleteOnRollback = newThumbnailUrl;
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
          @Override
          public void afterCompletion(int status) {
            if (status == STATUS_ROLLED_BACK) {
              try {
                fileUtil.deleteFile(urlToDeleteOnRollback, "post");
              } catch (IOException e) {
                log.error("게시글 썸네일 롤백 중 파일 삭제 실패", e);
              }
            }
          }
        });
      } catch (IOException e) {
        log.error("게시글 썸네일 이미지 파일 저장 실패", e);
        return ServiceResult.fail(ErrorCode.FILE_UPLOAD_ERROR);
      }
    }
    // 3. 새 파일은 없지만, DTO의 URL 값으로 이미지 삭제를 요청한 경우
    else {
      String urlFromRequest = postUpdateRequest.thumbnailUrl();
      // 요청 URL이 비어있고(null 또는 ""), 기존 URL은 존재할 때 -> 이미지 삭제로 간주
      if ((urlFromRequest == null || urlFromRequest.isEmpty()) && (newThumbnailUrl != null
          && !newThumbnailUrl.isEmpty())) {
        try {
          fileUtil.deleteFile(newThumbnailUrl, "post");
          newThumbnailUrl = null; // DB에 저장할 URL도 null로 변경
        } catch (IOException e) {
          log.error("게시글 썸네일 삭제 실패: {}", newThumbnailUrl, e);
        }
      }
    }

    // 4. 게시글 정보 및 최종 결정된 썸네일 URL로 DB 업데이트
    post.updatePost(postUpdateRequest.title(), postUpdateRequest.content(),
        postUpdateRequest.link(), newThumbnailUrl);

    if (postUpdateRequest.tags() != null) {
      postTagService.updatePostTags(post, postUpdateRequest.tags());
    }

    return ServiceResult.ok(Map.of("postId", postId));
  }

  @Transactional
  public ServiceResult<Void> deletePost(Long postId, Long userDetailId) {
    log.info("PostService : deletePost(" + postId + ") 호출");

    Post post = postRepository.findById(postId).orElse(null);
    if (post == null) {
      return ServiceResult.fail(ErrorCode.POST_NOT_FOUND);
    }

    Member user = memberRepository.findById(userDetailId).orElse(null);
    if (user == null || (!userDetailId.equals(post.getMember().getId()) && user.getProvider() != Provider.ADMIN)) {
      return ServiceResult.fail(ErrorCode.AUTH_ACCESS_DENIED);
    }

    postRepository.delete(post);

    return ServiceResult.ok();
  }
}
