package com.tmi.backend.domain.star.controller;

import com.tmi.backend.domain.star.service.StarService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/star")
@RequiredArgsConstructor
public class StarController {

  private final StarService starService;
}
