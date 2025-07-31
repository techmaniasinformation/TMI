package com.tmi.backend.domain.postTag.repository;

import com.tmi.backend.domain.postTag.entity.PostTag;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostTagRepository extends JpaRepository<PostTag, Long> {

  List<PostTag> findAllByPostId(Long postId);
  void deleteAllByPostId(Long postId);
}
