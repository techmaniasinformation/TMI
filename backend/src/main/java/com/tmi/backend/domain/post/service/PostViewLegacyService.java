package com.tmi.backend.domain.post.service;

import com.tmi.backend.domain.comment.dto.CommentCount;
import com.tmi.backend.domain.comment.repository.CommentRepository;
import com.tmi.backend.domain.follow.company.repository.CompanyFollowRepository;
import com.tmi.backend.domain.follow.member.repository.MemberFollowRepository;
import com.tmi.backend.domain.member.entity.Member;
import com.tmi.backend.domain.member.repository.MemberRepository;
import com.tmi.backend.domain.notification.event.PostViewIncrementedEvent;
import com.tmi.backend.domain.post.dto.request.PostFilter;
import com.tmi.backend.domain.post.dto.request.PostSearchFilter;
import com.tmi.backend.domain.post.dto.response.DetailPostResponse;
import com.tmi.backend.domain.post.dto.response.SimplePostPageResponse;
import com.tmi.backend.domain.post.dto.response.SimplePostSearchResponse;
import com.tmi.backend.domain.post.entity.Post;
import com.tmi.backend.domain.post.repository.PostRepository;
import com.tmi.backend.domain.postScore.repository.PostScoreRepository;
import com.tmi.backend.domain.star.entity.Star;
import com.tmi.backend.domain.star.repository.StarRepository;
import com.tmi.backend.domain.tag.service.TagService;
import com.tmi.backend.global.common.entity.AppliedFilters;
import com.tmi.backend.global.common.response.ServiceResult;
import com.tmi.backend.global.error.ErrorCode;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostViewLegacyService implements PostViewService {

  private final PostRepository postRepository;
  private final StarRepository starRepository;
  private final MemberRepository memberRepository;
  private final MemberFollowRepository memberFollowRepository;
  private final CompanyFollowRepository companyFollowRepository;
  private final PostScoreRepository postScoreRepository;
  private final CommentRepository commentRepository;
  private final TagService tagService;
  private final ApplicationEventPublisher publisher;

  @Override
  public ServiceResult<SimplePostPageResponse> readPosts(PostFilter filter, int page, int size) {

    if (page <= 0 || size <= 0)
      return ServiceResult.fail(ErrorCode.POST_INVALID_LINK);

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

  @Override
  public ServiceResult<SimplePostPageResponse> readFollowPosts(Long followMemberId, int page, int size) {
    log.info("PostViewService : readFollowPosts(" + followMemberId + ") 호출");

    List<Long> followeeIds = memberFollowRepository.findByFollowerId(followMemberId)
        .stream()
        .map(mf -> mf.getFollowee().getId())
        .toList();

    List<Long> companyIds = companyFollowRepository.findByFollowerId(followMemberId)
        .stream()
        .map(cf -> cf.getCompany().getId())
        .toList();


    Pageable pageable = PageRequest.of(page - 1, size, Sort.Direction.DESC, "createdAt");

    Page<Post> postPage = postRepository
        .findByMember_IdInOrCompany_IdIn(followeeIds, companyIds, pageable);

    List<Long> postIds = postPage.getContent().stream()
        .map(Post::getId).toList();

    Map<Long, Integer> countMap = commentRepository.findCountByPostIds(postIds)
        .stream()
        .collect(Collectors.toMap(CommentCount::getPostId, CommentCount::getCnt));

    return ServiceResult.ok(SimplePostPageResponse.of(postPage, page, countMap));
  }

  @Override
  public ServiceResult<SimplePostPageResponse> readCompanyPosts(Long companyId, int page, int size) {
    log.info("PostViewService : readCompanyPosts(" + companyId + ") 호출");

    Pageable pageable = PageRequest.of(page - 1, size);

    Page<Post> postPage = postRepository.findByCompanyIdOrderByCreatedAtDesc(companyId, pageable);

    List<Long> postIds = postPage.getContent().stream()
        .map(Post::getId).toList();

    Map<Long, Integer> countMap = commentRepository.findCountByPostIds(postIds)
        .stream()
        .collect(Collectors.toMap(CommentCount::getPostId, CommentCount::getCnt));

    return ServiceResult.ok(SimplePostPageResponse.of(postPage, page, countMap));
  }

  @Override
  public ServiceResult<SimplePostPageResponse> readMemberPosts(Long memberId, int page, int size) {
    log.info("PostViewService : readMemberPosts(" + memberId + ") 호출");

    Pageable pageable = PageRequest.of(page - 1, size);

    Page<Post> postPage = postRepository.findByMemberIdOrderByCreatedAtDesc(memberId, pageable);

    List<Long> postIds = postPage.getContent().stream()
        .map(Post::getId).toList();

    Map<Long, Integer> countMap = commentRepository.findCountByPostIds(postIds)
        .stream()
        .collect(Collectors.toMap(CommentCount::getPostId, CommentCount::getCnt));

    return ServiceResult.ok(SimplePostPageResponse.of(postPage, page, countMap));
  }

  @Override
  public ServiceResult<SimplePostPageResponse> readStarPosts(Long starMemberId, int page, int size) {
    log.info("PostViewService : readStarPosts(" + starMemberId + ") 호출");

    Pageable pageable = PageRequest.of(page - 1, size);

    Member member = memberRepository.findById(starMemberId).orElse(null);

    Page<Star> starPage  = starRepository.findByMemberOrderByPostCreatedAtDesc(member, pageable);

    Page<Post> postPage = starPage.map(Star::getPost);

    List<Long> postIds = postPage.getContent().stream()
        .map(Post::getId).toList();

    Map<Long, Integer> countMap = commentRepository.findCountByPostIds(postIds)
        .stream()
        .collect(Collectors.toMap(CommentCount::getPostId, CommentCount::getCnt));

    return ServiceResult.ok(SimplePostPageResponse.of(postPage, page, countMap));
  }

  @Override
  public ServiceResult<SimplePostPageResponse> readLatest(int page, int size) {
    log.info("PostViewService : readLatest() 호출");

    Pageable pageable = PageRequest.of(page - 1, size);

    Page<Post> postPage = postRepository.findAllByOrderByCreatedAtDesc(pageable);

    List<Long> postIds = postPage.getContent().stream()
        .map(Post::getId).toList();

    Map<Long, Integer> countMap = commentRepository.findCountByPostIds(postIds)
        .stream()
        .collect(Collectors.toMap(CommentCount::getPostId, CommentCount::getCnt));

    return ServiceResult.ok(SimplePostPageResponse.of(postPage, page, countMap));
  }

  @Override
  public ServiceResult<SimplePostSearchResponse> searchPosts(PostSearchFilter filter, int size, int page) {
    log.info("PostViewService : searchPosts() 호출");

    Pageable pageable = PageRequest.of(page - 1, size);

    String query = filter.q() == null ? "" : filter.q();

    Page<Post> postPage = postRepository.search(
        query,
        filter.techTags(),
        filter.companyTags(),
        pageable);

    // 댓글 수 집계
    List<Long> postIds = postPage.getContent()
        .stream()
        .map(Post::getId).toList();

    Map<Long, Integer> countMap = commentRepository.findCountByPostIds(postIds)
        .stream()
        .collect(Collectors.toMap(CommentCount::getPostId, CommentCount::getCnt));

    // AppliedFilters 채우기 (태그 이름이 필요하다면 TagRepository 로 조회)
    AppliedFilters applied = AppliedFilters.of(
        query,
        tagService.findNames(filter.techTags()),
        tagService.findNames(filter.companyTags())
    );

    return ServiceResult.ok(
        SimplePostSearchResponse.of(postPage, page, countMap, applied)
    );
  }

  @Override
  @Transactional
  public ServiceResult<DetailPostResponse> readDetailPost(Long postId) {
    log.info("PostViewService : readDetailPost() 호출");

    Post post = postRepository.findById(postId).orElse(null);
    if (post == null) {
      return ServiceResult.fail(ErrorCode.POST_NOT_FOUND);
    }

    post.updateViewCount();

    int commentCount = commentRepository.countByPostId(postId);

    publisher.publishEvent(new PostViewIncrementedEvent(postId, post.getMember().getId(), post.getViewCount()));

    return ServiceResult.ok(DetailPostResponse.of(post, commentCount));
  }

  @Override
  public ServiceResult<SimplePostPageResponse> readPopularPosts(int size) {
    log.info("PostViewService : readPopularPosts() 호출");

    // 1. 점수 테이블에서 상위 PK 목록 조회
    Pageable limit = PageRequest.of(0, size);          // 첫 페이지만 필요
    List<Long> topIds = postScoreRepository.findTopPostIds(limit);

    if (topIds.isEmpty()) {          // 점수가 아직 없다면 최신글로 대체
      return readLatest(1, size);
    }

    // 2. 실제 Post 엔티티 로딩
    List<Post> posts = postRepository.findByIdIn(topIds);

    // 3. 점수순 정렬 유지 (IN 쿼리는 순서 보장 X)
    Map<Long, Post> map = posts.stream()
        .collect(Collectors.toMap(Post::getId, p -> p));
    List<Post> ordered = topIds.stream()
        .map(map::get)
        .filter(Objects::nonNull)
        .toList();

    // 4. 댓글 수 집계
    List<Long> postIds = ordered.stream().map(Post::getId).toList();
    Map<Long, Integer> countMap = commentRepository.findCountByPostIds(postIds)
        .stream()
        .collect(Collectors.toMap(CommentCount::getPostId, CommentCount::getCnt));

    // 5. Page 래핑 → 기존 DTO 그대로 재사용
    Page<Post> page = new PageImpl<>(ordered, limit, ordered.size());

    return ServiceResult.ok(SimplePostPageResponse.of(page, 1, countMap));
  }
}
