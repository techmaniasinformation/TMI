FROM jenkins/jenkins:lts

USER root

# 필수 도구 설치
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    sudo && \
    # Docker GPG 키 추가
    mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg && \
    # Docker 저장소 추가
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
      $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    # 저장소 목록 업데이트 후 Docker 및 기타 도구 설치
    apt-get update && apt-get install -y \
    openjdk-17-jdk \
    git \
    unzip \
    docker.io && \
    rm -rf /var/lib/apt/lists/*

# Node.js 설치 - React를 사용하는 프론트 코드를 빌드하기 위해 Node.js를 설치합니다.
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm && \
    rm -rf /var/lib/apt/lists/*

# root 권한으로 패키지 설치하려면 USER 변경
USER root

# 기본 패키지 업데이트 및 curl 설치
RUN apt-get update && apt-get install -y curl

# docker-compose 설치 (최신 버전)
RUN curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose && \
  chmod +x /usr/local/bin/docker-compose

# Adoptium GPG 키 및 APT 저장소 등록& JDK 21 설치
RUN mkdir -p /usr/share/keyrings && \
    curl -fsSL https://packages.adoptium.net/artifactory/api/gpg/key/public | gpg --dearmor -o /usr/share/keyrings/adoptium.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/adoptium.gpg] https://packages.adoptium.net/artifactory/deb bookworm main" > /etc/apt/sources.list.d/adoptium.list && \
    apt-get update && apt-get install -y temurin-21-jdk && \
    rm -rf /var/lib/apt/lists/*

# 환경 변수 설정 (Java 21을 기본으로)
ENV JAVA17_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV JAVA21_HOME=/usr/lib/jvm/temurin-21-jdk-amd64
ENV JAVA_HOME=$JAVA21_HOME
ENV PATH="$JAVA_HOME/bin:$PATH"

# Jenkins가 Docker를 사용할 수 있도록
RUN usermod -aG docker jenkins

