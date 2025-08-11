package com.tmi.backend.domain.postTag.service;

import com.tmi.backend.domain.post.entity.Post;
import com.tmi.backend.domain.postTag.entity.PostTag;
import com.tmi.backend.domain.postTag.repository.PostTagRepository;
import com.tmi.backend.domain.tag.entity.Tag;
import com.tmi.backend.domain.tag.repository.TagRepository;
import com.tmi.backend.domain.tag.service.TagService;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostTagService {

  private final PostTagRepository postTagRepository;
  private final TagService tagService;

  @Transactional
  public void createPostTags(Post post, List<String> tags) {
    log.info("PostTagService : createPostTags() 호출");

    List<PostTag> postTags = tagService.findTechTags(tags).stream()
        .map(tag -> PostTag.of(post, tag))
        .toList();

    postTagRepository.saveAll(postTags);
  }

  @Transactional
  public void updatePostTags(Post post, List<String> tags) {
    log.info("PostTagService : updatePostTags() 호출");

    postTagRepository.deleteAllByPostId(post.getId());
    postTagRepository.flush();
    
    List<PostTag> postTags = tagService.findTechTags(tags).stream()
        .map(tag -> PostTag.of(post, tag))
        .toList();

    postTagRepository.saveAll(postTags);
  }

  public void deletePostTags(Long postId) {
    log.info("PostTagService : deletePostTags() 호출");

    postTagRepository.deleteAllByPostId(postId);
  }
}
