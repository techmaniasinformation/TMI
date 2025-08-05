package com.tmi.backend.domain.tag.service;

import com.tmi.backend.domain.tag.dto.request.TagSearchRequest;
import com.tmi.backend.domain.tag.entity.Tag;
import com.tmi.backend.domain.tag.entity.TagType;
import com.tmi.backend.domain.tag.repository.TagRepository;
import com.tmi.backend.global.common.response.ServiceResult;
import com.tmi.backend.global.error.ErrorCode;
import com.tmi.backend.global.error.exception.BusinessException;
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

    return tagRepository.findAllByTagTypeAndNameIn(TagType.TECH, tags);
  }

  public ServiceResult<TagSearchRequest> searchTags(String keyword) {
    log.info("TagService : searchTags(" + keyword + ") 호출");

    if (keyword == null) {
      return ServiceResult.ok(TagSearchRequest.of(tagRepository.findAll()));
    }

    if (keyword.isBlank()) {
      return ServiceResult.fail(ErrorCode.SEARCH_TERM_MISSING);
    }

    return ServiceResult.ok(TagSearchRequest.of(tagRepository.findByNameContainingIgnoreCase(keyword)));
  }
}
