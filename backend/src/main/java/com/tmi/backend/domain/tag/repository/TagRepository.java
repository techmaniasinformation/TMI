package com.tmi.backend.domain.tag.repository;

import com.tmi.backend.domain.tag.entity.Tag;
import com.tmi.backend.domain.tag.entity.TagType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

  List<Tag> findAllByTagTypeAndNameIn(TagType tagType, List<String> names);
  List<Tag> findByNameContainingIgnoreCase(String keyword);
  @Query("""
    select t.name
      from Tag t
     where t.id in :ids
  """)
  List<String> findNamesByIdIn(@Param("ids") List<Integer> ids);

  Optional<Tag> findByTagTypeAndName(TagType tagType, String name);
}
