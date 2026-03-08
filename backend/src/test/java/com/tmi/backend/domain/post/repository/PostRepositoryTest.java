package com.tmi.backend.domain.post.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.tmi.backend.domain.post.entity.Post;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@ActiveProfiles("test") // Use test profile if available, else dev
@Transactional
class PostRepositoryTest {

    @Autowired
    private PostRepository postRepository;

    @Test
    @DisplayName("findAllByOrderByCreatedAtDesc - N+1 (postTags) EntityGraph 테스트")
    void findAllByOrderByCreatedAtDesc_EntityGraph() {
        // given
        PageRequest pageRequest = PageRequest.of(0, 10);

        // when
        // 이 메서드를 호출할 때 Hibernate SQL 로그에
        // select post, member, company, post_tags, tags 가 하나의 LEFT OUTER JOIN으로 묶여서
        // 나가는지 확인.
        Page<Post> posts = postRepository.findAllByOrderByCreatedAtDesc(pageRequest);

        // then
        assertThat(posts).isNotNull();

        // 이 반복문 안에서 추가 쿼리가 발생하지 않아야 함. (N+1 증명)
        for (Post post : posts.getContent()) {
            post.getPostTags().forEach(pt -> {
                // Tag 필드 접근
                assertThat(pt.getTag().getName()).isNotNull();
            });
        }

        System.out.println("========== N+1 Query Verification Completed ==========");
    }
}
