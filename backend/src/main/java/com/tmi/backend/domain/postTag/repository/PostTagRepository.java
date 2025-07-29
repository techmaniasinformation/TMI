package com.tmi.backend.domain.postTag.repository;

import com.tmi.backend.domain.postTag.entity.PostTag;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostTagRepository extends JpaRepository<PostTag, Long> {

  List<PostTag> findAllByPost_Id(Long postId);
  void deleteAllByPost_Id(Long postId);
}
