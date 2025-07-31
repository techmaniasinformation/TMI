package com.tmi.backend.domain.comment.controller;

import com.tmi.backend.domain.comment.dto.request.CommentRequest;
import com.tmi.backend.domain.comment.service.CommentService;
import com.tmi.backend.global.common.response.ApiResponse;
import com.tmi.backend.global.common.response.impl.ApiSuccessResponse;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/comment")
@RequiredArgsConstructor
public class CommentController {

  private final CommentService commentService;

  @PostMapping
  public ApiResponse<Map<String, Long>> registerComment(@Valid @RequestBody CommentRequest commentRequest) {
    return ApiSuccessResponse.success(commentService.register(commentRequest));
  }

  @DeleteMapping("/{commentId}")
  public ApiResponse<Void> deleteComment(@PathVariable Long commentId) {
    commentService.delete(commentId);
    return ApiSuccessResponse.success();
  }
}
