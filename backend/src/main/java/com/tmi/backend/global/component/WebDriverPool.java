package com.tmi.backend.global.component;

import io.github.bonigarcia.wdm.WebDriverManager;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.stereotype.Component;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

@Slf4j
@Component
public class WebDriverPool {

  private static final int POOL_SIZE = 5;
  private final BlockingQueue<WebDriver> pool = new ArrayBlockingQueue<>(POOL_SIZE);

  @PostConstruct
  public void init() {
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
    if (driver == null) {
      return;
    }

    if (isDriverAlive(driver)) {
      // 드라이버 상태 초기화 로직
      driver.manage().deleteAllCookies();
      driver.get("about:blank");
      pool.offer(driver);
    } else {
      log.warn("죽은 WebDriver를 감지하여 풀에서 제거하고 새로 생성합니다.");
      driver.quit();
      pool.offer(createDriver());
    }
  }

  private boolean isDriverAlive(WebDriver driver) {
    try {
      // getWindowHandles()는 드라이버 세션이 살아있는지 확인하는 가장 안정적인 방법 중 하나입니다.
      return !driver.getWindowHandles().isEmpty();
    } catch (Exception e) {
      // 예외 발생 시 드라이버가 비정상 상태임을 의미
      return false;
    }
  }

  private WebDriver createDriver() {
    ChromeOptions options = new ChromeOptions();
    options.addArguments("--headless=new");
    options.addArguments("--disable-gpu");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");
    return new ChromeDriver(options);
  }

}
