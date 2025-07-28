package com.tmi.backend.domain.tag.repository;

import com.tmi.backend.domain.tag.entity.Tag;
import com.tmi.backend.domain.tag.entity.TagType;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

  List<Tag> findAllByTagTypeAndNameIn(TagType tagType, List<String> names);
  List<Tag> findByNameContainingIgnoreCase(String keyword);
}
