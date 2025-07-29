package com.tmi.backend.domain.tag.dto.request;

import com.tmi.backend.domain.tag.entity.Tag;
import com.tmi.backend.domain.tag.entity.TagType;
import java.util.ArrayList;
import java.util.List;
import lombok.Builder;

public record TagSearchRequest(
    List<TechTag>    techTags,
    List<CompanyTag> companyTags
) {

  public static TagSearchRequest of(List<Tag> tags) {
    List<TechTag> tech  = new ArrayList<>();
    List<CompanyTag> corp  = new ArrayList<>();

    for (Tag tag : tags) {
      if (tag.getTagType() == TagType.TECH) {
        tech.add(new TechTag(tag.getId().intValue(), tag.getName()));
      } else if (tag.getTagType() == TagType.COMPANY) {
        corp.add(new CompanyTag(tag.getId().intValue(), tag.getName()));
      }
    }
    return new TagSearchRequest(tech, corp);
  }
}
