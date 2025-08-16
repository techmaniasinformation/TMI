# <img src="img/TMI_logo.png" width="25" height="25"/> 1. 서비스 소개 


![서비스 소개](img/TMI_landing.gif)


## 1) TMI이란?

`TMI`은 **Tech Mania's Information** 의 약자로, 다양한 플랫폼에 흩어져 있는 `기술블로그`의 글을 모아서 볼 수 있는 `큐레이션 커뮤니티 서비스`입니다.

개발자는 하루에도 수차례 원하는 정보를 검색하지만, 광고성 블로그나 신뢰하기 어려운 글에 시간을 허비하기 쉽습니다. `TMI` 는 이런 문제를 해결하기 위해 **자동 요약과 태그 기반 검색**을 제공하여, 원하는 정보를 빠르고 정확하게 확인할 수 있도록 돕습니다.

관심 있는 기술을 설정하면 해당 주제를 다루는 글을 추천받을 수 있고, 마음에 드는 글은 팔로워들과 함께 공유하며 토론할 수 있습니다. 단순히 정보를 소비하는 것을 넘어 **팔로우, 댓글, 추천, 뱃지 시스템**을 통해 커뮤니티 경험을 제공합니다.

### `TMI` 핵심 가치
- *Easy Search* : 태그 중심의 빠르고 직관적인 검색
- *High Quality* : AI 요약과 자동 태그로 신뢰성 높은 정보 제공
- *By Sharing* : 팔로우, 알림, 뱃지를 통한 지속적 소통과 학습

## 2) 개발기간

- 2025-07-14 ~ 2025-08-18 (총6주)
  - Sub1 : 2025-07-14 ~ 2025-07-20
  - Sub2 : 2025-07-21 ~ 2025-08-01
  - Sub3 : 2025-08-03 ~ 2025-08-19

## 3) 산출물 모아보기

**와이어프레임**


👉 [Figma](https://www.figma.com/design/xLg08rwjPnpnF8fNrDpRLy/%EA%B3%B5%ED%86%B5-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8?node-id=0-1&t=nwiGkqgRz5QkPDja-0) 에서 살펴보기


**컴포넌트 구조도**

👉 [Figma](https://www.figma.com/design/xLg08rwjPnpnF8fNrDpRLy/%EA%B3%B5%ED%86%B5-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8?node-id=0-1&t=nwiGkqgRz5QkPDja-0) 에서 살펴보기

**기능 기획서**

👉 [팀 노션 페이지](https://enchanted-headphones-9a0.notion.site/229cf38b9ab18134a582d43ad604361e?pvs=73) 링크

 **API 명세서**

👉 [팀 노션 페이지](https://enchanted-headphones-9a0.notion.site/API-229cf38b9ab1817da423eacd3693bde6) 링크

**시연 UCC**

👉 [영상]() 으로 확인하기


## 4) 팀 소개
  - 박승규
    - Frontend
      - 게시글 관리 시스템 구현
      - 검색 및 필터링 인터페이스 개발
      - API 연동 및 소셜 기능 구현
      - 컴포넌트 아키텍처 설계 및 상태 관리
  - 서윤미
    - Frontend
      - ㅁㄴㅇ
  - 소태호
    - 팀장 업무
      - ㅁㄴㅇ
    - 프로젝트 기획 및 설계
      - ㅁㄴㅇ
    - Backend
      - ㅁㄴㅇ
  - 윤여옥
    - 프로젝트 기획 및 설계
      - 기획 및 기능 정의
      - DB 및 API 설계
    - Backend
      - JWT 인증 & 권한부여
      - 로그인 & 회원가입 기능
      - 회원관리 기능
      - 팔로우 / 알림 / 뱃지 기능  
    - 기타:
      - 최종 발표
      - 최종 발표 자료 작성
  - 이은성
    - 프로젝트 기획 및 설계
      - 기획 및 기능 정의
      - DB 및 API 설계
    - Backend
      - 인기 게시글 선정 기능 및 게시글 검색 기능    
      - 최신 게시글 조회 및 팔로우, 스타 게시글 조회 기능
      - 상세 게시글 조회 및 게시글 작성, 수정, 삭제 기능
      - 댓글 / 댓글 추천 / 태그 조회 및 검색 기능
      - SSE 를 활용한 실시간 알림 전송 기능
      - Event - Listener 구조를 활용한 뱃지 획득 기능
    - 기타
      - 중간 발표
  - 하재민
    - 기획 및 설계
      - 화면 설계서 작성 및 정리
      - 배지 이미지 제작 및 적용
    - Frontend
      - 마이페이지 및 알림 페이지 퍼블리싱
      - 각 페이지별 API 연동 개발
      - 기능 오류 수정 및 품질 개선

## 5) 기능 소개

![기능 소개]()

### (1) 게시글 및 AI 요약

![게시글 및 AI 요약]()


### (2) 커뮤니티 기능

![커뮤니티 기능]()

### (3) 팔로우 및 스타

![팔로우 및 스타]()

### (4) 뱃지 획득 및 전시

![뱃지 획득 및 전시]()


## 6) 기술 스택

![기술 스택]()

🖱**Backend**

- Java 1.17
- SpringBoot 3.5.3
- Spring Security
- Spring Data JPA
- MySQL 8.0.23

🖱**Frontend**

- React19
- TypeScript
- Tailwind CSS
- Zustand

🖱**CI/CD**

- AWS EC2
- Docker
- Nginx
- Jenkins

# <img src="img/TMI_logo.png" width="25" height="25"/>  2. 기획

## 1) 화면정의서

![화면정의서](img/TMI_screen.png)

👉 [Figma](https://www.figma.com/design/xLg08rwjPnpnF8fNrDpRLy/%EA%B3%B5%ED%86%B5-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8?node-id=0-1&t=nwiGkqgRz5QkPDja-0) 에서 살펴보기

## 2) 와이어프레임
![와이어프레임](img/TMI_frame.png)

👉 [Figma](https://www.figma.com/design/xLg08rwjPnpnF8fNrDpRLy/%EA%B3%B5%ED%86%B5-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8?node-id=0-1&t=nwiGkqgRz5QkPDja-0) 에서 살펴보기


## 3) 컴포넌트 구조도(FE)

![컴포넌트 구조도](img/TMI_component.png)

👉 [Figma](https://www.figma.com/design/xLg08rwjPnpnF8fNrDpRLy/%EA%B3%B5%ED%86%B5-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8?node-id=0-1&t=nwiGkqgRz5QkPDja-0) 에서 살펴보기


# <img src="img/TMI_logo.png" width="25" height="25"/>  3. 설계

## 1) ERD
![ERD](img/TMI_ERD.png)

## 2) 요구사항 정의서

![page 1](img/TMI_page_1.png)
![page 2](img/TMI_page_2.png)

👉 [팀 노션 페이지](https://enchanted-headphones-9a0.notion.site/229cf38b9ab18114812df967484a824a) 에서 더 살펴보기


## 3) API 명세서

![api 1](img/TMI_api_1.png)
![api 2](img/TMI_api_2.png)

👉 [팀 노션 페이지](https://enchanted-headphones-9a0.notion.site/API-229cf38b9ab1817da423eacd3693bde6?pvs=74) 에서 더 살펴보기

## 4) 아키텍쳐

![Architecture](img/TMI_Architecture.png)

# 3. 설치 및 사용법

깃랩에 접속해 `clone` 받으신 후, `clone` 받은 디렉토리에서 아래의 순서대로 설치를 진행합니다.  

👉 [깃랩 주소](https://lab.ssafy.com/s13-webmobile2-sub1/S13P11A509)

## 1) 백엔드

- [https://i13a509.p.ssafy.io/api/v1](https://i13a509.p.ssafy.io/api/v1) 이하로 요청 시 테스트 가능
- 사용법
  - clone 받은 후 sts나 IntelliJ에서 프로젝트 우클릭
  - Run as SpringBoot App으로 실행

## 2) 프론트엔드

- [Node.js](https://nodejs.org/ko/) 설치

- 프론트엔드 디렉토리로 이동.

```bash
cd {클론 받은 폴더}/frontend
```

- 아래의 명령어를 실행

```bash
npm install
npm run serve
```

# <img src="img/TMI_logo.png" width="25" height="25"/>  4. 협업

## 1) Git 활용

![Untitled 15-164432173907984](https://user-images.githubusercontent.com/67628725/167994478-b6906455-3b50-4eb0-951f-7c5b515e6e8f.png)

## 2) Git 컨벤션

- **브랜치 이름**

      유형-이슈넘버(jira)-기능ID-요약

- **Commit 메시지**

      [Jira-티켓명] <타입> 기능 내용 요약

- **Commit 유형**

  ```
  FEAT: 새로운 기능 추가 [#S06P12A101-89]
  FIX: 버그 수정 
  DOCS: 문서 수정
  STYLE: 코드 formatting, 세미콜론 누락, 코드 자체의 변경이 없는 경우
  REFACTOR: 코드 리팩토링
  TEST: 테스트 코드, 리팩토링 테스트 코드 추가
  CHORE: 패키지 매니저 수정, 그 외 기타 수정 ex) .gitignore
  DESIGN: CSS 등 사용자 UI 디자인 변경
  COMMENT: 필요한 주석 추가 및 변경
  RENAME: 파일 또는 폴더 명을 수정하거나 옮기는 작업만인 경우
  REMOVE: 파일을 삭제하는 작업만 수행한 경우
  ```

## 3) Jira

기능들을 `Jira` Issue로 등록, `업무 진행 상황`을 관리합니다. 각 이슈별로 기능별 ID, 스토리포인트, 담당자 등을 배분한 뒤 Jira issue를 등록합니다. 

번다운 차트를 활용하여, 스프린트에 작업할 스토리 포인트를 유연하게 설정하도록 합니다. 


참고자료 1: 
![지라 1](img/TMI_Jira_1.png)

참고자료 2: 
![지라 1](img/TMI_Jira_2.png)

## 4) Notion

### (1) 컨벤션 및 환경 설정 공유

협업에 필요한 규칙들과 설정들을 `매뉴얼화`하여 일목요연하게 관리합니다. 각종 환경 설정이나 설치법 등을 공유하여 셋팅 오류를 최소화하고 개발에 집중할 수 있습니다. 

![컨벤션](img/TMI_convention.png)

### (2) 기술 공유

참고할 만한 `외부 자료` 등을 `문서화` 후 공유하고 있습니다. 코딩 시 발생했던 `오류`들 또한 `문서화`하여 추후 `동일 문제가 발생`할 시 `신속하게 해결`할 수 있습니다. 

![기술 공유](img/TMI_skill.png)

### (3) 회의록 관리

팀원간 활발한 의사소통과 기획의 효율성을 높이기 위해 `꾸준한 회의`를 진행했으며, 회의록을 노션에 정리하고 필요시 참고할 수 있도록 했습니다. 

컨설턴트님 및 코치님들과 함께 미팅한 기록도 전부 문서화 하여, 피드백 시에 침고할 수 있도록 했습니다. 

![회의록 관리 1](img/TMI_meeting_1.png)
![회의록 관리 2](img/TMI_meeting_2.png)
