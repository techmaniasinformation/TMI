# 디렉토리 구조
```bash
.
├── docker-compose.yml
├── frontend
│         └── build
├── jenkins
│         ├── Dockerfile
│         └── jenkins_home
└── nginx
    ├── certbot
    ├── nginx.conf
    └── ssl
```

# docker-compose.yml
docker-compose 용 파일. 파일 내 주석으로 좀 더 세부적인 사항을 정리해놨습니다.

# ./frontend/build
jenkins와 nginx가 볼륨 마운트하는 장소입니다.  
`npm run build`의 결과물을 jenkins pipeline을 통해 생성한 후 저장되는 디렉토리입니다.

# Jenkins
### ./jenkins
jenkins의 이미지 빌드를 위해 Dockerfile과 /jenkins_home이 있습니다.
jenkins 컨테이너에서는 /jenkins_home을 볼륨 마운트하여 데이터 저장, 상태 저장 등 합니다.

Dockerfile의 내용은 주석으로 자세하게 서술했습니다.

# Nginx
### ./nginx/certbot
TLS 인증을 위한 certbot 관련 파일이 있습니다. 인증서 발급 시 도메인 소유권 검증을 할 때 쓰는 경로가 있거나
Certbot이 발급한 인증서를 저장하거나 합니다.

### ./nginx/nginx.conf
nginx 관련 설정 파일입니다. 자세한 내용은 주석으로 작성했습니다.

### SSL
실제 SSL/TLS 인증서와 개인키를 저장하는 곳입니다.

```yaml
volumes:
  - ./nginx/certbot/conf:/etc/letsencrypt:ro
  - ./nginx/certbot:/var/www/certbot
```
docker-compose.yml에서 볼륨 마운트하여 컨테이너에서도 인증서나 키를 확인할 수 있게 합니다.

