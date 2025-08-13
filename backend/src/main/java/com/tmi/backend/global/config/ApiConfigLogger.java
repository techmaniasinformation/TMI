package com.tmi.backend.global.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ApiConfigLogger {

  @Value("${api.prefix}")
  private String apiPrefix;

  @PostConstruct
  public void init() {
    System.out.println("API Prefix: " + apiPrefix);
  }
}
