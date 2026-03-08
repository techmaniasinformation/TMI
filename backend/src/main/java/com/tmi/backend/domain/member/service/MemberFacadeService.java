package com.tmi.backend.domain.member.service;

import com.tmi.backend.domain.member.dto.request.MemberUpdateRequest;
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
public class MemberFacadeService {

    private final MemberService memberService;
    private final FileUtil fileUtil;

    public ServiceResult<Map<String, Long>> updateMember(
            Long memberId,
            MemberUpdateRequest req,
            MultipartFile profileImage) {
        log.info("MemberFacadeService : updateMember(" + memberId + ") 호출");

        String newProfileUrl = null;
        boolean isNewFileUpload = false;

        // 1. 새로운 썸네일 이미지가 업로드된 경우 (Out of DB Transaction Scope)
        if (profileImage != null && !profileImage.isEmpty()) {
            try {
                newProfileUrl = fileUtil.saveFile(profileImage, "profile");
                isNewFileUpload = true;
            } catch (IOException e) {
                log.error("멤버 프로필 이미지 파일 저장 실패", e);
                return ServiceResult.fail(ErrorCode.FILE_UPLOAD_ERROR);
            }
        }

        // 2. Database Update & Delete Old Image (Inner Transaction DB call + URL string
        // handling)
        ServiceResult<MemberService.UpdateMemberResult> dbResult = memberService.updateMemberWithUrl(memberId, req,
                newProfileUrl, isNewFileUpload);

        if (!dbResult.success()) {
            // 3. Rollback DB failure (새로 올린 이미지가 있다면 수동 삭제)
            if (isNewFileUpload && newProfileUrl != null) {
                try {
                    fileUtil.deleteFile(newProfileUrl, "profile");
                } catch (IOException e) {
                    log.error("멤버 프로필 이미지 롤백 중 파일 수동 삭제 실패", e);
                }
            }
            return ServiceResult.fail(dbResult.code());
        }

        // 4. Cleanup old images upon successful update
        String oldProfileUrlToDelete = dbResult.data().oldProfileUrlToDelete();
        if (oldProfileUrlToDelete != null && !oldProfileUrlToDelete.isEmpty()
                && !oldProfileUrlToDelete.equals("default.png")) {
            try {
                fileUtil.deleteFile(oldProfileUrlToDelete, "profile");
            } catch (IOException e) {
                log.error("기존 프로필 이미지 삭제 실패: {}", oldProfileUrlToDelete, e);
            }
        }

        return ServiceResult.ok(dbResult.data().responseMap());
    }

}
