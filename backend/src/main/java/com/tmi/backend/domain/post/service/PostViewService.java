package com.tmi.backend.domain.post.service;

import com.tmi.backend.domain.post.dto.request.PostFilter;
import com.tmi.backend.domain.post.dto.request.PostSearchFilter;
import com.tmi.backend.domain.post.dto.response.DetailPostResponse;
import com.tmi.backend.domain.post.dto.response.SimplePostPageResponse;
import com.tmi.backend.domain.post.dto.response.SimplePostSearchResponse;
import com.tmi.backend.domain.post.repository.PostRepository;
import com.tmi.backend.global.error.ErrorCode;
import com.tmi.backend.global.error.exception.BusinessException;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostViewService {

  private final PostRepository postRepository;

  public SimplePostPageResponse readPosts(PostFilter filter, int page, int size) {

    if (page <= 0 || size <= 0)
      throw new BusinessException(ErrorCode.POST_INVALID_LINK);

    if (filter.followMemberId() != null)
      return readFollowPosts(filter.followMemberId(), page, size);

    if (filter.companyId() != null)
      return readCompanyPosts(filter.companyId(), page, size);

    if (filter.memberId() != null)
      return readMemberPosts(filter.memberId(), page, size);

    if (filter.starMemberId() != null)
      return readStarPosts(filter.starMemberId(), page, size);

    return readLatest(page, size);
  }

  public SimplePostPageResponse readFollowPosts(Long followMemberId, int page, int size) {
    log.info("PostViewService : readFollowPosts(" + followMemberId + ") 호출");

    return null;
  }

  public SimplePostPageResponse readCompanyPosts(Long companyId, int page, int size) {
    log.info("PostViewService : readCompanyPosts(" + companyId + ") 호출");

    return null;
  }

  public SimplePostPageResponse readMemberPosts(Long memberId, int page, int size) {
    log.info("PostViewService : readMemberPosts(" + memberId + ") 호출");

    return null;
  }

  public SimplePostPageResponse readStarPosts(Long starMemberId, int page, int size) {
    log.info("PostViewService : readStarPosts(" + starMemberId + ") 호출");

    return null;
  }

  public SimplePostPageResponse readLatest(int page, int size) {
    log.info("PostViewService : readLatest() 호출");

    return null;
  }

  public SimplePostSearchResponse searchPosts(PostSearchFilter filter, int size, int page) {
    log.info("PostViewService : searchPosts() 호출");

    return null;
  }

  public DetailPostResponse readDetailPost(Long postId) {
    log.info("PostViewService : readDetailPost() 호출");

    return null;
  }

  public SimplePostPageResponse readPopularPosts(@Positive int size) {
    log.info("PostViewService : readPopularPosts() 호출");

    return null;
  }
}
