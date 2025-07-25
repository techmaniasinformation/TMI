package com.tmi.backend.global.common.entity;

public record PageDetail(long totalElements, int totalPages, boolean isLast, int currPage) {
  public static PageDetail of(long totalElements, int totalPages, boolean isLast, int currPage) {
    return new PageDetail(totalElements, totalPages, isLast, currPage);
  }
}
