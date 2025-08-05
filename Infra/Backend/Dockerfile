FROM eclipse-temurin:17-jdk
COPY build/libs/*SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-Dspring.profiles.active=dev", "-jar", "app.jar"]

# spring build 용 Dockerfile
# 원래 꿈은 application.yml을 prod, dev, test로 만들어서 특정 branch에서 push하면
# 상황에 맞는 -Dspring.profiles.active 인자를 선택하려 했으나 시간의 제약으로 인해 포기