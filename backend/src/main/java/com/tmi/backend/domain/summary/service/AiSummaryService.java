package com.tmi.backend.domain.summary.service;

import com.tmi.backend.domain.summary.dto.response.SummaryResponse;
import com.tmi.backend.global.common.response.ServiceResult;
import com.tmi.backend.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StopWatch;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AiSummaryService {

  private final SummaryAgent summaryAgent;

  public ServiceResult<SummaryResponse> getAiSummary(String url) {
    log.info("에이전트를 통한 웹 요약 시작: {}", url);
    StopWatch sw = new StopWatch("AI_Agent_Full_Process");

    try {
      sw.start("Total_Agent_Reasoning_Time");
      SummaryResponse result = summaryAgent.summarize(url);
      sw.stop();

      log.info("요약 완료: {}", result.summary());
      log.info("Agent 최종 결과 생성 완료");
      log.info("\n{}", sw.prettyPrint());
      return ServiceResult.ok(result);
    } catch (Exception e) {
      log.error("에이전트 실행 중 오류 발생: ", e);
      return ServiceResult.fail(ErrorCode.SUMMARY_FAILED);
    }
  }
}