package com.tmi.backend.global.common.controller;

import com.tmi.backend.global.common.response.ApiResponse;
import com.tmi.backend.global.common.response.ServiceResult;
import com.tmi.backend.global.common.response.impl.ApiErrorResponse;
import com.tmi.backend.global.common.response.impl.ApiSuccessResponse;
import org.springframework.http.ResponseEntity;

public class BaseController {
  protected <T> ResponseEntity<ApiResponse<T>> handle(ServiceResult<T> result) {
    if (!result.success()) {
      return ApiErrorResponse.errorEntity(result.code(), null);
    }
    return ApiSuccessResponse.successEntity(result.data());
  }
}
