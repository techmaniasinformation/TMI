package com.tmi.backend.domain.post.repository;

import com.tmi.backend.domain.post.entity.Post;
import com.tmi.backend.domain.post.entity.PostMetrics;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

  @Query("""
      SELECT MAX(p.createdAt)
      FROM Post p
      WHERE p.company.id = :companyId
      """)
  Optional<LocalDateTime> findLatestCreatedAtById(@Param("companyId") Long companyId);

  @EntityGraph(attributePaths = {
      "member",
      "company",
      "postTags.tag"
  })
  Optional<Post> findById(Long id);

  @EntityGraph(attributePaths = {
      "member",
      "company"
  })
  Page<Post> findByMemberIdOrderByCreatedAtDesc(Long memberId, Pageable pageable);

  @EntityGraph(attributePaths = {
      "member",
      "company"
  })
  Page<Post> findByCompanyIdOrderByCreatedAtDesc(Long companyId, Pageable pageable);

  @EntityGraph(attributePaths = {
      "member",
      "company"
  })
  Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);

  @EntityGraph(attributePaths = {"member", "company"})
  @Query("""
  select distinct p
    from Post p
    left join p.postTags pt
    left join pt.tag t
  where lower(p.title) like lower(concat('%', :q, '%'))
    and ( :#{#techTagIds == null || #techTagIds.isEmpty()} = true
         or t.id in :techTagIds )
    and ( :#{#companyTagIds == null || #companyTagIds.isEmpty()} = true
         or p.company.id in :companyTagIds )
  """)
  Page<Post> search(@Param("q")             String q,
      @Param("techTagIds")    List<Integer> techTagIds,
      @Param("companyTagIds") List<Integer> companyTagIds,
      Pageable pageable);

  Page<Post> findByMember_IdInOrCompany_IdIn(
      List<Long> memberIds,
      List<Long> companyIds,
      Pageable pageable
  );

  @Query("""
       select p.id          as postId,
              p.viewCount   as viewCount,
              p.starCount   as starCount,
              p.createdAt   as createdAt
       from   Post p
    """)
  List<PostMetrics> findAllMetrics();

  List<Post> findByIdIn(List<Long> ids);
}
