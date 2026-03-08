package com.tmi.backend.domain.member.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import com.tmi.backend.domain.member.dto.request.MemberUpdateRequest;
import com.tmi.backend.domain.member.service.MemberService.UpdateMemberResult;
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
class MemberFacadeServiceTest {

    @InjectMocks
    private MemberFacadeService memberFacadeService;

    @Mock
    private MemberService memberService;

    @Mock
    private FileUtil fileUtil;

    @Mock
    private MultipartFile profileImage;

    @Test
    @DisplayName("updateMember: 새 프로필 이미지 업로드 후 내부 DB 성공 시, 기존 파일을 반환받아 삭제해야 한다")
    void updateMember_success_andDeleteOldProfile() throws IOException {
        // given
        Long memberId = 1L;
        MemberUpdateRequest request = mock(MemberUpdateRequest.class);
        String newUrl = "https://s3.tmi.com/profile/new.jpg";
        String oldUrlToDelete = "https://s3.tmi.com/profile/old.jpg";

        given(profileImage.isEmpty()).willReturn(false);
        given(fileUtil.saveFile(profileImage, "profile")).willReturn(newUrl);

        UpdateMemberResult dbResult = new UpdateMemberResult(Map.of("memberId", memberId), oldUrlToDelete);
        given(memberService.updateMemberWithUrl(memberId, request, newUrl, true))
                .willReturn(ServiceResult.ok(dbResult));

        // when
        ServiceResult<Map<String, Long>> result = memberFacadeService.updateMember(memberId, request, profileImage);

        // then
        assertThat(result.success()).isTrue();
        verify(fileUtil).deleteFile(oldUrlToDelete, "profile"); // 수동 파일 삭제 여부 검증
    }

    @Test
    @DisplayName("updateMember: 새 프로필 이미지 업로드 후 내부 DB 저장이 실패하면, 애꿎게 올린 파일을 수동 롤백 삭재해야 한다")
    void updateMember_rollbackFile_whenDbFails() throws IOException {
        // given
        Long memberId = 1L;
        MemberUpdateRequest request = mock(MemberUpdateRequest.class);
        String uploadedUrl = "https://s3.tmi.com/profile/uploaded.jpg";

        given(profileImage.isEmpty()).willReturn(false);
        given(fileUtil.saveFile(profileImage, "profile")).willReturn(uploadedUrl);

        given(memberService.updateMemberWithUrl(memberId, request, uploadedUrl, true))
                .willReturn(ServiceResult.fail(ErrorCode.FILE_UPLOAD_ERROR));

        // when
        ServiceResult<Map<String, Long>> result = memberFacadeService.updateMember(memberId, request, profileImage);

        // then
        assertThat(result.success()).isFalse();
        verify(fileUtil).deleteFile(uploadedUrl, "profile"); // 트랜잭션 수동 롤백 여부 검증
    }
}
