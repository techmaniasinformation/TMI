package com.tmi.backend.domain.tag.dto.response;

import com.tmi.backend.domain.tag.entity.Tag;
import com.tmi.backend.domain.tag.entity.TagType;
import java.util.ArrayList;
import java.util.List;

public record TagSearchResponse(
    List<TechTag>    techTags,
    List<CompanyTag> companyTags
) {

  public static TagSearchResponse of(List<Tag> tags) {
    List<TechTag> tech  = new ArrayList<>();
    List<CompanyTag> corp  = new ArrayList<>();

    for (Tag tag : tags) {
      if (tag.getTagType() == TagType.TECH) {
        tech.add(new TechTag(tag.getId().intValue(), tag.getName()));
      } else if (tag.getTagType() == TagType.COMPANY) {
        corp.add(new CompanyTag(tag.getId().intValue(), tag.getName()));
      }
    }
    return new TagSearchResponse(tech, corp);
  }
}
