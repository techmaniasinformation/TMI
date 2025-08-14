package com.tmi.backend.global.component;

import io.github.bonigarcia.wdm.WebDriverManager;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.stereotype.Component;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

@Component
public class WebDriverPool {

  private static final int POOL_SIZE = 5;
  private final BlockingQueue<WebDriver> pool = new ArrayBlockingQueue<>(POOL_SIZE);

  @PostConstruct
  public void init() {
    WebDriverManager.chromedriver().setup();
    for (int i = 0; i < POOL_SIZE; i++) {
      pool.offer(createDriver());
    }
  }

  @PreDestroy
  public void cleanup() {
    for (WebDriver driver : pool) {
      driver.quit();
    }
  }

  public WebDriver borrowDriver() throws InterruptedException {
    return pool.take(); // 드라이버가 없으면 대기
  }

  public void returnDriver(WebDriver driver) {
    if (driver != null) {
      pool.offer(driver);
    }
  }

  private WebDriver createDriver() {
    ChromeOptions options = new ChromeOptions();
    options.addArguments("--headless");
    options.addArguments("--disable-gpu");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");
    return new ChromeDriver(options);
  }

}
