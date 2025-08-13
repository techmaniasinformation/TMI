package com.tmi.backend.global.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@ConfigurationProperties(prefix = "api")
@Component
public class ApiProperties {

  private String prefix;

}