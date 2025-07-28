package com.tmi.backend.domain.tag.service;

import com.tmi.backend.domain.tag.entity.Tag;
import com.tmi.backend.domain.tag.repository.TagRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TagService {

  private final TagRepository tagRepository;

  public List<Tag> findTechTags(List<String> tags) {
    log.info("TagService : findTechTags() 호출");

    return tagRepository.findAllByNameIn(tags);
  }
}
