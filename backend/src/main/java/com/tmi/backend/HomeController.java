package com.tmi.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
  @GetMapping("/")
  public String home() {
    return "SSAFY 13th A509 Jenkins TEST";
  }
}
