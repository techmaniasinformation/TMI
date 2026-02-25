package com.tmi.backend.domain.post.service;


import com.tmi.backend.domain.post.dto.request.PostFilter;
import com.tmi.backend.domain.post.dto.request.PostSearchFilter;
import com.tmi.backend.domain.post.dto.response.DetailPostResponse;
import com.tmi.backend.domain.post.dto.response.SimplePostPageResponse;
import com.tmi.backend.domain.post.dto.response.SimplePostSearchResponse;
import com.tmi.backend.global.common.response.ServiceResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional(readOnly = true)
public class PostViewCacheService implements PostViewService {

  private final PostViewService delegate;

  public PostViewCacheService(@Qualifier("postViewLegacyService") PostViewService delegate) {
    this.delegate = delegate;
  }

  @Cacheable(
      cacheNames = "post:list",
      keyGenerator = "pageKeyGen",
      unless = "#result == null || !#result.success()"
  )
  @Override
  public ServiceResult<SimplePostPageResponse> readPosts(PostFilter filter, int page, int size) {
    return delegate.readPosts(filter, page, size);
  }

  @Override
  public ServiceResult<SimplePostPageResponse> readFollowPosts(Long followMemberId, int page,
      int size) {
    return delegate.readFollowPosts(followMemberId, page, size);
  }

  @Override
  public ServiceResult<SimplePostPageResponse> readCompanyPosts(Long companyId, int page,
      int size) {
    return delegate.readCompanyPosts(companyId, page, size);
  }

  @Override
  public ServiceResult<SimplePostPageResponse> readMemberPosts(Long memberId, int page, int size) {
    return delegate.readMemberPosts(memberId, page, size);
  }

  @Override
  public ServiceResult<SimplePostPageResponse> readStarPosts(Long starMemberId, int page,
      int size) {
    return delegate.readStarPosts(starMemberId, page, size);
  }

  @Cacheable(
      cacheNames = "post:latest",
      keyGenerator = "pageKeyGen",
      unless = "#result == null || !#result.success()"
  )
  @Override
  public ServiceResult<SimplePostPageResponse> readLatest(int page, int size) {
    return delegate.readLatest(page, size);
  }

  @Cacheable(
      cacheNames = "post:search",
      keyGenerator = "pageKeyGen",
      unless = "#result == null || !#result.success()"
  )
  @Override
  public ServiceResult<SimplePostSearchResponse> searchPosts(PostSearchFilter filter, int size,
      int page) {
    return delegate.searchPosts(filter, size, page);
  }

  @Override
  public ServiceResult<DetailPostResponse> readDetailPost(Long postId) {
    return delegate.readDetailPost(postId);
  }

  @Cacheable(
      cacheNames = "post:popular",
      keyGenerator = "pageKeyGen",
      unless = "#result == null || !#result.success()"
  )
  @Override
  public ServiceResult<SimplePostPageResponse> readPopularPosts(int size) {
    return delegate.readPopularPosts(size);
  }
}
