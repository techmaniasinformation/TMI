package com.tmi.backend.domain.postTag.scheduler;

import com.tmi.backend.domain.tag.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class TagDeleteScheduler {

  private final TagRepository tagRepository;

  @Scheduled(cron = "0 0/10 * * * *")
  @Transactional
  public void purgeAll() {
    int deleted = tagRepository.deleteAllUnused();
    log.info("[UnusedTagCleanup] deleted unused tags = {}", deleted);
  }
}
