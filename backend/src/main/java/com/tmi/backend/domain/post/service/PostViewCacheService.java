package com.tmi.backend.domain.post.service;


import com.tmi.backend.domain.post.dto.request.PostFilter;
import com.tmi.backend.domain.post.dto.request.PostSearchFilter;
import com.tmi.backend.domain.post.dto.response.DetailPostResponse;
import com.tmi.backend.domain.post.dto.response.SimplePostPageResponse;
import com.tmi.backend.domain.post.dto.response.SimplePostSearchResponse;
import com.tmi.backend.global.common.response.ServiceResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostViewCacheService implements PostViewService{

  @Override
  public ServiceResult<SimplePostPageResponse> readPosts(PostFilter filter, int page, int size) {
    return null;
  }

  @Override
  public ServiceResult<SimplePostPageResponse> readFollowPosts(Long followMemberId, int page,
      int size) {
    return null;
  }

  @Override
  public ServiceResult<SimplePostPageResponse> readCompanyPosts(Long companyId, int page,
      int size) {
    return null;
  }

  @Override
  public ServiceResult<SimplePostPageResponse> readMemberPosts(Long memberId, int page, int size) {
    return null;
  }

  @Override
  public ServiceResult<SimplePostPageResponse> readStarPosts(Long starMemberId, int page,
      int size) {
    return null;
  }

  @Override
  public ServiceResult<SimplePostPageResponse> readLatest(int page, int size) {
    return null;
  }

  @Override
  public ServiceResult<SimplePostSearchResponse> searchPosts(PostSearchFilter filter, int size,
      int page) {
    return null;
  }

  @Override
  public ServiceResult<DetailPostResponse> readDetailPost(Long postId) {
    return null;
  }

  @Override
  public ServiceResult<SimplePostPageResponse> readPopularPosts(int size) {
    return null;
  }
}
