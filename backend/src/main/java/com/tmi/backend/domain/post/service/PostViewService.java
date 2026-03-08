package com.tmi.backend.domain.post.service;

import com.tmi.backend.domain.post.dto.request.PostFilter;
import com.tmi.backend.domain.post.dto.request.PostSearchFilter;
import com.tmi.backend.domain.post.dto.response.DetailPostResponse;
import com.tmi.backend.domain.post.dto.response.SimplePostPageResponse;
import com.tmi.backend.domain.post.dto.response.SimplePostSearchResponse;
import com.tmi.backend.global.common.response.ServiceResult;

public interface PostViewService {

  public ServiceResult<SimplePostPageResponse> readPosts(PostFilter filter, int page, int size);

  public ServiceResult<SimplePostPageResponse> readFollowPosts(Long followMemberId, int page, int size);

  public ServiceResult<SimplePostPageResponse> readCompanyPosts(Long companyId, int page, int size);

  public ServiceResult<SimplePostPageResponse> readMemberPosts(Long memberId, int page, int size);

  public ServiceResult<SimplePostPageResponse> readStarPosts(Long starMemberId, int page, int size);

  public ServiceResult<SimplePostPageResponse> readLatest(int page, int size);

  public ServiceResult<SimplePostSearchResponse> searchPosts(PostSearchFilter filter, int size, int page);

  public ServiceResult<DetailPostResponse> readDetailPost(Long postId, String viewerId);

  public ServiceResult<SimplePostPageResponse> readPopularPosts(int size);
}
