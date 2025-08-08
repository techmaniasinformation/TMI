package com.tmi.backend.domain.badge.entity;


import lombok.Getter;

@Getter
public enum BadgeType {

  FIRST_ARTICLE(1L, "이건 머지?"),
  FIRST_COMMENT(2L, "애는 머지?"),
  HELLO_WORLD(3L, "헬로 월드"),
  STAR_5(4L, "별이 다섯개!"),
  STAR_13(5L, "별이 13개!"),
  STAR_42(6L, "별이 42개!"),
  AMUMU(7L, "날선택"),
  FC_TMI(8L, "FC TMI"),
  EXPLOSION(9L, "인기 폭발"),
  LIKE_10(10L, "추천 10개"),
  LIKE_100(11L, "추천 100개"),
  LIKE_1000(12L, "천근추"),
  VIEW_50(13L, "웅성"),
  VIEW_100(14L, "웅성웅성"),
  VIEW_1000(15L, "웅성웅성웅성"),
  PARIS(16L, "벌레잡는 파리채"),
  SPRING(17L, "Spring"),
  REACT(18L, "React"),
  AI(19L, "AI"),
  DB(20L, "DB"),
  AWS(21L, "AWS"),
  NONE(22L, "");

  private final Long id;
  private final String name;

  BadgeType(Long id, String name) {
    this.id = id;
    this.name = name;
  }
}

