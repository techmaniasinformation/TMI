package com.tmi.backend.domain.postScore.repository;

import com.tmi.backend.domain.postScore.entity.PostScore;
import java.util.List;

public interface PostScoreCustom {
  void bulkUpsert(List<PostScore> scores);
}
