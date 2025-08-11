package com.tmi.backend.domain.tag.service;

import com.tmi.backend.domain.tag.dto.response.TagSearchResponse;
import com.tmi.backend.domain.tag.entity.Tag;
import com.tmi.backend.domain.tag.entity.TagType;
import com.tmi.backend.domain.tag.repository.TagRepository;
import com.tmi.backend.global.common.response.ServiceResult;
import com.tmi.backend.global.error.ErrorCode;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
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

  @Transactional
  public Tag createTag(String name, TagType type) {
    Tag tag = tagRepository.save(Tag.of(name, type));
    return tag;
  }

  public List<Tag> findTechTags(List<String> tags) {
    log.info("TagService : findTechTags() 호출");

    List<Tag> tagList = new ArrayList<>();
    for (String tagName : tags) {
      Tag tag = tagRepository.findByTagTypeAndName(TagType.TECH, tagName).orElse(null);

      if (Objects.isNull(tag)) {
        tagList.add(createTag(tagName, TagType.TECH));
      } else {
        tagList.add(tag);
      }
    }

    return tagList;
//    return tagRepository.findAllByTagTypeAndNameIn(TagType.TECH, tags);
  }

  public ServiceResult<TagSearchResponse> searchTags(String keyword) {
    log.info("TagService : searchTags(" + keyword + ") 호출");

    if (keyword == null) {
      return ServiceResult.ok(TagSearchResponse.of(tagRepository.findAll()));
    }

    if (keyword.isBlank()) {
      return ServiceResult.fail(ErrorCode.SEARCH_TERM_MISSING);
    }

    return ServiceResult.ok(TagSearchResponse.of(tagRepository.findByNameContainingIgnoreCase(keyword)));
  }

  public List<String> findNames(List<Integer> tagIds) {
    return (tagIds == null || tagIds.isEmpty())
        ? List.of()
        : tagRepository.findNamesByIdIn(tagIds);
  }
}
