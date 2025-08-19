package com.tmi.backend.domain.postScore.scheduler;

import com.tmi.backend.domain.post.entity.PostMetrics;
import com.tmi.backend.domain.post.repository.PostRepository;
import com.tmi.backend.domain.postScore.entity.PostScore;
import com.tmi.backend.domain.postScore.repository.PostScoreRepository;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@EnableScheduling
@RequiredArgsConstructor
public class PopularPostScheduler {

  private final PostRepository postRepository;
  private final PostScoreRepository postScoreRepository;

  /** 10분마다 재계산 */
  @Scheduled(cron = "0 0/10 * * * *")
  @Transactional
  public void recalcScores() {

    List<PostMetrics> metrics = postRepository.findAllMetrics();
    LocalDateTime now = LocalDateTime.now();
    double g = 1.8;

    List<PostScore> scores = metrics.stream()
        .map(m -> {

          /* --- 분자: 조회수 + (즐겨찾기 * 2) --- */
          double p = m.getViewCount() + (m.getStarCount() * 2);

          /* --- 분모: 시간 경과에 따른 감쇠 --- */
          long   hours  = ChronoUnit.HOURS.between(m.getCreatedAt(), now);
          double score  = Math.max(p, 1) / Math.pow(hours + 2, g);

          return PostScore.of(m.getPostId(), score, now);
        })
        .toList();

    postScoreRepository.bulkUpsert(scores);
  }

}
