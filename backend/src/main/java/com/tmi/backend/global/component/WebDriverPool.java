package com.tmi.backend.global.component;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class WebDriverPool {

  private WebDriver driver;
  private boolean inUse = false; // 드라이버 사용 여부 체크

  @PostConstruct
  public synchronized void init() {
    driver = createDriver();
  }

  private WebDriver createDriver() {
    ChromeOptions options = new ChromeOptions();
    options.addArguments("--headless=new");
    options.addArguments("--disable-gpu");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");
    // Docker 환경에서 안전한 임시 유저 데이터 디렉토리
    options.addArguments("--user-data-dir=/tmp/chrome-user-" + UUID.randomUUID());
    options.addArguments("--window-size=1920,1080");

    return new ChromeDriver(options);
  }

  /**
   * 드라이버 가져오기 (동시 요청 대기)
   */
  public synchronized WebDriver getDriver() throws InterruptedException {
    while (inUse) {
      wait(); // 다른 스레드가 반환할 때까지 대기
    }
    inUse = true;
    return driver;
  }

  /**
   * 사용 후 드라이버 반환
   */
  public synchronized void releaseDriver() {
    inUse = false;
    notifyAll(); // 대기 중인 스레드 깨움
  }

  @PreDestroy
  public synchronized void destroy() {
    if (driver != null) {
      try {
        driver.quit();
      } catch (Exception ignored) {}
      driver = null;
    }
  }
}
