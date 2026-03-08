package com.tmi.backend.domain.post.service;

import com.tmi.backend.domain.post.dto.request.PostCreateRequest;
import com.tmi.backend.domain.post.dto.request.PostUpdateRequest;
import com.tmi.backend.global.Utils.FileUtil;
import com.tmi.backend.global.common.response.ServiceResult;
import com.tmi.backend.global.error.ErrorCode;
import java.io.IOException;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostFacadeService {

    private final PostService postService;
    private final FileUtil fileUtil;

    public ServiceResult<Map<String, Long>> createPost(
            PostCreateRequest postCreateRequest,
            MultipartFile thumbnailImage) {
        log.info("PostFacadeService : createPost() 호출");

        String thumbnailUrl = null;

        // 1. File Upload (Out of DB Transaction Scope)
        if (thumbnailImage != null && !thumbnailImage.isEmpty()) {
            try {
                thumbnailUrl = fileUtil.saveFile(thumbnailImage, "post");
            } catch (IOException e) {
                log.error("썸네일 이미지 파일 저장 실패", e);
                return ServiceResult.fail(ErrorCode.FILE_UPLOAD_ERROR);
            }
        }

        // 2. Database Insert (Inner Transaction)
        ServiceResult<Map<String, Long>> result = postService.createPostWithUrl(postCreateRequest, thumbnailUrl);

        // 3. Rollback Action if DB operation fails
        if (!result.success() && thumbnailUrl != null) {
            try {
                fileUtil.deleteFile(thumbnailUrl, "post");
            } catch (IOException e) {
                log.error("게시글 썸네일 수동 롤백 중 파일 삭제 실패", e);
            }
        }

        return result;
    }

    public ServiceResult<Map<String, Long>> updatePost(
            Long postId,
            PostUpdateRequest postUpdateRequest,
            MultipartFile thumbnailImage) {
        log.info("PostFacadeService : updatePost(" + postId + ") 호출");

        String newThumbnailUrl = null;
        boolean isNewFileUpload = false;

        // 1. 새로운 썸네일 이미지가 업로드된 경우 (Out of DB Transaction Scope)
        if (thumbnailImage != null && !thumbnailImage.isEmpty()) {
            try {
                newThumbnailUrl = fileUtil.saveFile(thumbnailImage, "post");
                isNewFileUpload = true;
            } catch (IOException e) {
                log.error("게시글 썸네일 파일 저장 실패", e);
                return ServiceResult.fail(ErrorCode.FILE_UPLOAD_ERROR);
            }
        }

        // 2. Database Update & Delete Old Image (Inner Transaction DB call + URL string
        // handling)
        // DB에서 기존 URL을 삭제할 것인지 검사하고 업데이트
        ServiceResult<PostService.UpdatePostResult> dbResult = postService.updatePostWithUrl(postId, postUpdateRequest,
                newThumbnailUrl, isNewFileUpload);

        if (!dbResult.success()) {
            // 3. Rollback DB failure (새로 올린 이미지가 있다면 수동 삭제)
            if (isNewFileUpload && newThumbnailUrl != null) {
                try {
                    fileUtil.deleteFile(newThumbnailUrl, "post");
                } catch (IOException e) {
                    log.error("게시글 썸네일 롤백 중 파일 수동 삭제 실패", e);
                }
            }
            return ServiceResult.fail(dbResult.code());
        }

        // 4. Cleanup old images upon successful update
        String oldThumbnailUrlToDelete = dbResult.data().oldThumbnailUrlToDelete();
        if (oldThumbnailUrlToDelete != null && !oldThumbnailUrlToDelete.isEmpty()) {
            try {
                fileUtil.deleteFile(oldThumbnailUrlToDelete, "post");
            } catch (IOException e) {
                log.error("기존 게시글 썸네일 삭제 실패: {}", oldThumbnailUrlToDelete, e);
            }
        }

        return ServiceResult.ok(dbResult.data().responseMap());
    }

    public ServiceResult<Void> deletePost(Long postId) {
        log.info("PostFacadeService : deletePost(" + postId + ") 호출");

        // DB 삭제 먼저 수행, 그리고 기존 삭제해야할 이미지 url 반환
        ServiceResult<String> dbResult = postService.deletePostWithUrlReturn(postId);

        if (dbResult.success() && dbResult.data() != null && !dbResult.data().isEmpty()) {
            try {
                fileUtil.deleteFile(dbResult.data(), "post");
            } catch (IOException e) {
                log.error("게시글 삭제에 따른 썸네일 삭제 실패: {}", dbResult.data(), e);
            }
        }

        return dbResult.success() ? ServiceResult.ok() : ServiceResult.fail(dbResult.code());
    }
}
