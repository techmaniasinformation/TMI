package com.tmi.backend.domain.post.service;

import com.tmi.backend.domain.post.dto.request.PostFilter;
import com.tmi.backend.domain.post.dto.request.PostSearchFilter;
import com.tmi.backend.domain.post.dto.response.DetailPostRequest;
import com.tmi.backend.domain.post.dto.response.SimplePostPageRequest;
import com.tmi.backend.domain.post.dto.response.SimplePostSearchRequest;
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

  public SimplePostPageRequest readPosts(PostFilter filter, int page, int size) {

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

  public SimplePostPageRequest readFollowPosts(Long followMemberId, int page, int size) {
    log.info("PostViewService : readFollowPosts(" + followMemberId + ") 호출");

    return null;
  }

  public SimplePostPageRequest readCompanyPosts(Long companyId, int page, int size) {
    log.info("PostViewService : readCompanyPosts(" + companyId + ") 호출");

    return null;
  }

  public SimplePostPageRequest readMemberPosts(Long memberId, int page, int size) {
    log.info("PostViewService : readMemberPosts(" + memberId + ") 호출");

    return null;
  }

  public SimplePostPageRequest readStarPosts(Long starMemberId, int page, int size) {
    log.info("PostViewService : readStarPosts(" + starMemberId + ") 호출");

    return null;
  }

  public SimplePostPageRequest readLatest(int page, int size) {
    log.info("PostViewService : readLatest() 호출");

    return null;
  }

  public SimplePostSearchRequest searchPosts(PostSearchFilter filter, int size, int page) {
    log.info("PostViewService : searchPosts() 호출");

    return null;
  }

  public DetailPostRequest readDetailPost(Long postId) {
    log.info("PostViewService : readDetailPost() 호출");

    return null;
  }

  public SimplePostPageRequest readPopularPosts(@Positive int size) {
    log.info("PostViewService : readPopularPosts() 호출");

    return null;
  }
}
