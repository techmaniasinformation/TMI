package com.tmi.backend.domain.post.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import com.tmi.backend.domain.post.dto.request.PostCreateRequest;
import com.tmi.backend.domain.post.dto.request.PostUpdateRequest;
import com.tmi.backend.domain.post.service.PostService.UpdatePostResult;
import com.tmi.backend.global.Utils.FileUtil;
import com.tmi.backend.global.common.response.ServiceResult;
import com.tmi.backend.global.error.ErrorCode;
import java.io.IOException;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

@ExtendWith(MockitoExtension.class)
class PostFacadeServiceTest {

    @InjectMocks
    private PostFacadeService postFacadeService;

    @Mock
    private PostService postService;

    @Mock
    private FileUtil fileUtil;

    @Mock
    private MultipartFile thumbnailImage;

    @Test
    @DisplayName("createPost: 파일 업로드 성공 후 내부 DB 저장이 실패하면, 업로드된 파일을 수동 롤백 삭재해야 한다")
    void createPost_rollbackFile_whenDbFails() throws IOException {
        // given
        PostCreateRequest request = mock(PostCreateRequest.class);
        String uploadedUrl = "https://s3.tmi.com/post/image.jpg";

        given(thumbnailImage.isEmpty()).willReturn(false);
        given(fileUtil.saveFile(thumbnailImage, "post")).willReturn(uploadedUrl);

        // DB 저장 실패 상황 모의 (내부 트랜잭션 롤백)
        given(postService.createPostWithUrl(request, uploadedUrl))
                .willReturn(ServiceResult.fail(ErrorCode.FILE_UPLOAD_ERROR));

        // when
        ServiceResult<Map<String, Long>> result = postFacadeService.createPost(request, thumbnailImage);

        // then
        assertThat(result.success()).isFalse();
        assertThat(result.code()).isEqualTo(ErrorCode.FILE_UPLOAD_ERROR);
        verify(fileUtil).deleteFile(uploadedUrl, "post"); // 파사드가 수동으로 파일을 롤백 삭제했는지 명확히 검증 (TDD 규칙 만족)
    }

    @Test
    @DisplayName("updatePost: 새 파일 업로드 후 내부 DB 성공 시, 기존 파일을 반환받아 삭제해야 한다")
    void updatePost_success_andDeleteOldFile() throws IOException {
        // given
        Long postId = 1L;
        PostUpdateRequest request = mock(PostUpdateRequest.class);
        String newUrl = "https://s3.tmi.com/post/new.jpg";
        String oldUrlToDelete = "https://s3.tmi.com/post/old.jpg";

        given(thumbnailImage.isEmpty()).willReturn(false);
        given(fileUtil.saveFile(thumbnailImage, "post")).willReturn(newUrl);

        UpdatePostResult dbResult = new UpdatePostResult(Map.of("postId", postId), oldUrlToDelete);
        given(postService.updatePostWithUrl(postId, request, newUrl, true)).willReturn(ServiceResult.ok(dbResult));

        // when
        ServiceResult<Map<String, Long>> result = postFacadeService.updatePost(postId, request, thumbnailImage);

        // then
        assertThat(result.success()).isTrue();
        verify(fileUtil).deleteFile(oldUrlToDelete, "post"); // 이전 썸네일을 정상 삭제했는지 검증
    }
}
