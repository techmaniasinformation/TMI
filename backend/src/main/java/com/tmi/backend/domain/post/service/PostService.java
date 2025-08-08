package com.tmi.backend.domain.post.service;

import static org.springframework.transaction.support.TransactionSynchronization.STATUS_ROLLED_BACK;

import com.tmi.backend.domain.member.entity.Member;
import com.tmi.backend.domain.member.repository.MemberRepository;
import com.tmi.backend.domain.post.dto.request.PostCreateRequest;
import com.tmi.backend.domain.post.dto.request.PostUpdateRequest;
import com.tmi.backend.domain.post.entity.Post;
import com.tmi.backend.domain.post.repository.PostRepository;
import com.tmi.backend.domain.postTag.service.PostTagService;
import com.tmi.backend.global.Utils.FileUtil;
import com.tmi.backend.global.common.response.ServiceResult;
import com.tmi.backend.global.error.ErrorCode;
import com.tmi.backend.global.error.exception.BusinessException;
import java.io.IOException;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

  // TODO : 인증 로직 구현
  @Transactional
  public ServiceResult<Map<String, Long>> createPost(
      PostCreateRequest postCreateRequest,
      MultipartFile thumbnailImage
  ) {
    log.info("PostService : createPost() 호출");

    Member member = memberRepository.findById(postCreateRequest.memberId()).orElse(null);
    if (member == null) {
      return ServiceResult.fail(ErrorCode.USER_NOT_FOUND);
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

    return ServiceResult.ok(Map.of("postId", save.getId()));
  }

  @Transactional
  public ServiceResult<Map<String, Long>> updatePost(Long postId,
      PostUpdateRequest postUpdateRequest,
      MultipartFile thumbnailImage
  ) {
    log.info("PostService : updatePost(" + postId + ") 호출");

    Post post = postRepository.findById(postId).orElse(null);
    if (post == null) {
      return ServiceResult.fail(ErrorCode.POST_NOT_FOUND);
    }

    post.change(postUpdateRequest.title(), postUpdateRequest.content(),
        postUpdateRequest.link(), postUpdateRequest.thumbnailUrl());

    if (postUpdateRequest.tags() != null) {
      postTagService.updatePostTags(post, postUpdateRequest.tags());
    }

    return ServiceResult.ok(Map.of("postId", postId));
  }

  @Transactional
  public ServiceResult<Void> deletePost(Long postId) {
    log.info("PostService : deletePost(" + postId + ") 호출");

    Post post = postRepository.findById(postId).orElse(null);
    if (post == null) {
      return ServiceResult.fail(ErrorCode.POST_NOT_FOUND);
    }

    //postTagService.deletePostTags(post.getId());
    postRepository.delete(post);

    // TODO : 게시글의 댓글까지 연쇄 삭제 필요 -> commentService 등장 이후 구현
    return ServiceResult.ok();
  }
}
