FROM eclipse-temurin:17-jdk

# 필수 패키지 설치
RUN apt-get update && apt-get install -y \
    wget unzip curl fontconfig libnss3 libx11-6 libx11-xcb1 \
    libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 \
    libxi6 libxtst6 libglib2.0-0 libatk1.0-0 libatk-bridge2.0-0 \
    libcups2 libdrm2 libgbm1 libasound2 fonts-liberation \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Chrome 설치
RUN wget "https://storage.googleapis.com/chrome-for-testing-public/139.0.7258.68/linux64/chrome-linux64.zip" -O chrome-linux64.zip \
    && unzip chrome-linux64.zip \
    && chmod +x chrome-linux64/chrome \
    && mv chrome-linux64/chrome /usr/local/bin/google-chrome \
    && rm -rf chrome-linux64 chrome-linux64.zip

# ChromeDriver 설치
RUN wget "https://storage.googleapis.com/chrome-for-testing-public/139.0.7258.68/linux64/chromedriver-linux64.zip" -O chromedriver-linux64.zip \
    && unzip chromedriver-linux64.zip \
    && chmod +x chromedriver \
    && mv chromedriver /usr/local/bin/ \
    && rm -rf chromedriver-linux64.zip

# 심볼릭 링크 생성 (/usr/bin/chromedriver 참조 문제 해결)
RUN ln -sf /usr/local/bin/chromedriver /usr/bin/chromedriver

# 애플리케이션 복사
COPY build/libs/*SNAPSHOT.jar app.jar

# 실행
ENTRYPOINT ["java", "-Dspring.profiles.active=dev", "-jar", "app.jar"]
