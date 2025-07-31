package com.tmi.backend.domain.tag.dto.request;

import com.tmi.backend.domain.tag.entity.Tag;
import com.tmi.backend.domain.tag.entity.TagType;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;

@Data
public class TagSearchRequest {

  private List<TechTag> techTags = new ArrayList<>();
  private List<CompanyTag> companyTags = new ArrayList<>();


  public static TagSearchRequest of(List<Tag> tags) {
    TagSearchRequest dto = new TagSearchRequest();

    for (Tag tag : tags) {
      if (tag.getTagType() == TagType.TECH) {
        dto.getTechTags()
            .add(new TechTag(tag.getId().intValue(), tag.getName()));
      } else if (tag.getTagType() == TagType.COMPANY) {
        dto.getCompanyTags()
            .add(new CompanyTag(tag.getId().intValue(), tag.getName()));
      }
    }
    return dto;
  }
}
