package com.tmi.backend.domain.postScore.repository;

import com.tmi.backend.domain.postScore.entity.PostScore;
import jakarta.persistence.EntityManager;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@RequiredArgsConstructor
public class PostScoreCustomImpl implements PostScoreCustom{

  private final EntityManager em;

  @Override
  @Transactional
  @Modifying(clearAutomatically = true, flushAutomatically = true)
  public void bulkUpsert(List<PostScore> scores) {

    final int batch = 1_000;
    int idx = 0;

    for (PostScore ps : scores) {
      // PK 충돌 시 UPDATE 가 일어나도록 merge 사용
      em.merge(ps);

      if (++idx % batch == 0) {
        em.flush();
        em.clear();
      }
    }
  }
}
