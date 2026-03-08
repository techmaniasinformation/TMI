package com.tmi.backend.domain.post.service;

import com.tmi.backend.domain.post.repository.PostRepository;
import java.time.Duration;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostViewRedisManager {

    private final RedisTemplate<String, String> redisTemplate;
    private final PostRepository postRepository;

    private static final String VIEW_RECORD_PREFIX = "post:view:record:"; // 중복 방지 (24h)
    private static final String VIEW_PENDING_KEY = "post:view:pending"; // DB 반영 대기 카운터 (Hash)
    private static final Duration TTL = Duration.ofHours(24);

    /**
     * 사용자의 조회 이력을 Redis에 추가하고, 새롭게 조회수가 올랐는지(Set에 새로 추가되었는지) 반환합니다.
     */
    public boolean incrementViewCountIfFirst(Long postId, String identifier) {
        String recordKey = VIEW_RECORD_PREFIX + postId;
        // Set에 유저 식별자 추가 (이미 존재 시 0, 신규 시 1)
        Long addedCount = redisTemplate.opsForSet().add(recordKey, identifier);

        // 새롭게 추가되었다면 보류 큐(Hash)의 카운트도 1 증가
        if (addedCount != null && addedCount > 0) {
            if (redisTemplate.getExpire(recordKey) == -1) {
                redisTemplate.expire(recordKey, TTL);
            }
            redisTemplate.opsForHash().increment(VIEW_PENDING_KEY, postId.toString(), 1);
            return true;
        }
        return false;
    }

    /**
     * 메모리에 집계된 대기중인 증가분(DB 미반영분)을 조회합니다.
     */
    public int getPendingViewCount(Long postId) {
        Object count = redisTemplate.opsForHash().get(VIEW_PENDING_KEY, postId.toString());
        if (count != null) {
            return Integer.parseInt(count.toString());
        }
        return 0;
    }

    /**
     * 매 3분마다 Redis에 대기중인 조회수를 DB에 벌크 업데이트하고 초기화합니다.
     */
    @Scheduled(fixedDelay = 180000) // 3분마다 실행
    @Transactional
    public void syncViewCountsToDb() {
        log.info("Starting Redis-to-DB sync for View Counts...");

        // 대기열에 있는 모든 증가분 가져오기
        var pendingCounts = redisTemplate.opsForHash().entries(VIEW_PENDING_KEY);
        if (pendingCounts.isEmpty()) {
            return;
        }

        for (var entry : pendingCounts.entrySet()) {
            Long postId = Long.valueOf(entry.getKey().toString());
            int increment = Integer.parseInt(entry.getValue().toString());

            if (increment > 0) {
                // DB에 벌크 증가 쿼리 실행
                postRepository.incrementViewCount(postId, increment);
            }
        }

        // 반영이 완료된 항목들은 큐에서 비운다.
        redisTemplate.delete(VIEW_PENDING_KEY);
    }
}
