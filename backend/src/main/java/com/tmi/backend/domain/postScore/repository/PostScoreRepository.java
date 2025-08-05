package com.tmi.backend.domain.postScore.repository;

import com.tmi.backend.domain.postScore.entity.PostScore;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PostScoreRepository extends JpaRepository<PostScore, Long>, PostScoreCustom {

  /** 점수순 상위 N개 게시글 PK */
  @Query("""
        select ps.postId
        from   PostScore ps
        order  by ps.score desc
    """)
  List<Long> findTopPostIds(Pageable pageable);
}
