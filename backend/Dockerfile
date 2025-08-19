# 1. 베이스 이미지
FROM eclipse-temurin:17-jdk

# 2. 필수 패키지 설치 (최신 OS 버전에 맞게 패키지 이름 수정)
RUN apt-get update && apt-get install -y \
    wget unzip fontconfig \
    libfontconfig1 libfreetype6 libnss3 libcups2 libdpkg-dev \
    libxi6 libxtst6 libxss1 libxrandr2 libasound2t64 libpangocairo-1.0-0 \
    libatk1.0-0 libatk-bridge2.0-0 libgtk-3-0 libdrm2 libgbm1 \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*

# 3. Chrome 설치
ENV CHROME_VERSION=139.0.7258.68
RUN wget "https://storage.googleapis.com/chrome-for-testing-public/${CHROME_VERSION}/linux64/chrome-linux64.zip" -O chrome-linux64.zip && \
    unzip chrome-linux64.zip && \
    chmod +x chrome-linux64/chrome && \
    mv chrome-linux64/chrome /usr/local/bin/google-chrome && \
    rm -rf chrome-linux64 chrome-linux64.zip

# 4. ChromeDriver 설치
RUN wget "https://storage.googleapis.com/chrome-for-testing-public/${CHROME_VERSION}/linux64/chromedriver-linux64.zip" -O chromedriver-linux64.zip && \
    unzip chromedriver-linux64.zip && \
    chmod +x chromedriver-linux64/chromedriver && \
    mv chromedriver-linux64/chromedriver /usr/local/bin/chromedriver && \
    rm -rf chromedriver-linux64 chromedriver-linux64.zip

# 5. 심볼릭 링크 (기존 경로 문제 해결용)
RUN ln -s /usr/local/bin/chromedriver /usr/bin/chromedriver

# 6. 앱 복사
COPY build/libs/*SNAPSHOT.jar app.jar

# 7. 엔트리포인트
ENTRYPOINT ["java", "-Dspring.profiles.active=dev", "-jar", "app.jar"]
