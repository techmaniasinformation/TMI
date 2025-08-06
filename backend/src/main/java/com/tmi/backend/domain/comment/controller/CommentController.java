package com.tmi.backend.domain.comment.controller;

import com.tmi.backend.domain.auth.util.CustomUserDetails;
import com.tmi.backend.domain.comment.dto.request.CommentRequest;
import com.tmi.backend.domain.comment.dto.request.SortType;
import com.tmi.backend.domain.comment.dto.response.MyCommentListResponse;
import com.tmi.backend.domain.comment.dto.response.PostCommentListResponse;
import com.tmi.backend.domain.comment.service.CommentService;
import com.tmi.backend.global.common.controller.BaseController;
import com.tmi.backend.global.common.response.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/comment")
@RequiredArgsConstructor
public class CommentController implements BaseController {

  private final CommentService commentService;

  /**
   * 댓글 등록 API
   * @param commentRequest 댓글 등록 dto
   * @param userDetails 로그인 유저만 가능
   */
  @PostMapping
  public ResponseEntity<ApiResponse<Map<String, Long>>> registerComment(
      @Valid @RequestBody CommentRequest commentRequest,
      @AuthenticationPrincipal CustomUserDetails userDetails
  ) {

    return handle(commentService.register(commentRequest, userDetails.getMemberId()));
  }

  /**
   * 댓글 삭제 API
   * @param commentId 삭제 댓글 ID
   * @param userDetails 본인만 가능
   */
  @DeleteMapping("/{commentId}")
  public ResponseEntity<ApiResponse<Void>> deleteComment(
      @PathVariable Long commentId,
      @AuthenticationPrincipal CustomUserDetails userDetails
  ) {

    return handle(commentService.delete(commentId, userDetails.getMemberId()));
  }

  /**
   * 멤버 댓글 조회 API
   * @param memberId 멤버 ID
   */
  @GetMapping(params = "memberId")
  public ResponseEntity<ApiResponse<MyCommentListResponse>> readMemberComments(
      @RequestParam Long memberId,
      @Positive @RequestParam(defaultValue = "1") int page,
      @Positive @RequestParam(defaultValue = "10") int size
  ) {
    return handle(commentService.readMemberComments(memberId, page, size));
  }

  /**
   * 게시글 댓글 조회 API
   * @param postId 게시글 ID
   * @param sort 정렬 기준 : oldest, popular
   */
  @GetMapping(params = "postId")
  public ResponseEntity<ApiResponse<PostCommentListResponse>> readPostComments(
      @RequestParam Long postId,
      @RequestParam(defaultValue = "oldest") SortType sort
  ) {
    return handle(commentService.readPostComments(postId, sort));
  }
}
