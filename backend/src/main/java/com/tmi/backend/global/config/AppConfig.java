package com.tmi.backend.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;

@Configuration
public class AppConfig {

  @Bean
  public RestClient openAiRestClient(@Value("${api.gms-key}") String apiKey) {
    return RestClient.builder()
        .baseUrl("https://gms.ssafy.io/gmsapi/api.openai.com")
        .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
        .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .build();
  }
}