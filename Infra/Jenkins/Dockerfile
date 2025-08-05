FROM jenkins/jenkins:lts

USER root

# Spring의 경우 JDK 17 버전을 사용하고 있어 Jenkins 컨테이너 내에서 설치합니다.
RUN apt-get update && apt-get install -y \
    openjdk-17-jdk \
    curl \
    git \
    gnupg2 \
    lsb-release \
    ca-certificates \
    sudo \
    unzip \
    docker.io \
 && rm -rf /var/lib/apt/lists/*

# Node.js 설치 - React를 사용하는 프론트 코드를 빌드하기 위해 Node.js를 설치합니다.
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm && \
    rm -rf /var/lib/apt/lists/*

# Adoptium GPG 키 및 APT 저장소 등록 - OpenJDK 21을 설치하기 위해 키를 등록합니다.
RUN mkdir -p /usr/share/keyrings && \
    curl -fsSL https://packages.adoptium.net/artifactory/api/gpg/key/public | gpg --dearmor -o /usr/share/keyrings/adoptium.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/adoptium.gpg] https://packages.adoptium.net/artifactory/deb bookworm main" > /etc/apt/sources.list.d/adoptium.list

# OpenJDK 21 설치 - Jenkins의 경우 Java 17을 곧 지원 중단(2026년 언저리)하기 때문에 JDK 21을 따로 설치해서 사용합니다.
RUN apt-get update && apt-get install -y temurin-21-jdk && \
    rm -rf /var/lib/apt/lists/*

# 환경 변수 설정 - Java 21을 기본으로 하되, Spring을 빌드할 때는 Java 17을 사용하기 위해 환경 변수로 등록을 합니다.
ENV JAVA17_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV JAVA21_HOME=/usr/lib/jvm/temurin-21-jdk-amd64
ENV JAVA_HOME=$JAVA21_HOME
ENV PATH="$JAVA_HOME/bin:$PATH"

# DooD 방식에서 Jenkins가 Docker를 사용할 수 있도록합니다. docker 그룹에 속해 있어야 Docker 소켓 파일에 접근이 가능합니다.
# root와 동등한 권한을 주기 때문에 잠재적인 보안 위협이 있습니다. 하지만 일반적으로 DinD보다 덜 위협
RUN usermod -aG docker jenkins