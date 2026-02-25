# Redis Cache Performance Report

## 실험 배경
- 게시글 조회 API(`GET /api/v1/post`, `GET /api/v1/post/popular`)에 Redis 캐시를 적용했을 때 성능 개선 효과를 확인하기 위한 비교 실험
- 동일한 k6 부하 시나리오에서 캐시 OFF/ON 두 케이스를 각각 측정

## 실험 환경
- 실행 일시: 2026-02-25
- 애플리케이션: Spring Boot 3.5.3, Java 17, `dev` 프로필
- 데이터베이스: MySQL 8.0 (Docker, host port `3307`)
- 캐시: Redis 7 (Docker, host port `6379`, 컨테이너 `tmi-redis`)
- 부하 도구: k6 (`perf/k6/post-view-load.js`)

## 실험 조건
- 비교군
- Before: `FEATURE_POST_VIEW_CACHE_ENABLED=false`
- After: `FEATURE_POST_VIEW_CACHE_ENABLED=true`
- 트래픽 시나리오 (`ramping-vus`)
- 2분: 50 VUs (warm-up)
- 10분: 200 VUs (steady)
- 2분: 400 VUs (spike)
- 1분: 0 VUs (cool-down)
- 요청 비율
- `GET /api/v1/post?page=1&size=10` : 60%
- `GET /api/v1/post/popular?size=10` : 40%

| Metric | Before (cache off) | After (cache on) | Delta |
|---|---:|---:|---:|
| Latency p95 (ms) | 357.54 | 45.73 | -87.21% (improved) |
| Latency avg (ms) | 99.79 | 12.20 | -87.77% (improved) |
| Error rate (%) | 0.00 | 0.00 | N/A (regressed) |
| Request rate (req/s) | 464.43 | 652.86 | +40.57% (improved) |

## Files
- Before: `./perf/results/before.json`
- After: `./perf/results/after.json`

## 핵심 비교 (before.json -> after.json)
- http_req_duration avg: 99.79ms -> 12.20ms (약 `87.8%` 감소)
- http_req_duration p95: 357.54ms -> 45.73ms (약 `87.2%` 감소)
- http_req_duration p90: 279.02ms -> 25.49ms (약 `90.9%` 감소)
- http_reqs rate: 464.43 req/s -> 652.86 req/s (약 `40.6%` 증가)
- iterations count: 418,081 -> 587,591 (동일 시간 대비 처리량 증가)

## 안정성 지표
- checks는 둘 다 100% 성공 (status is 200)
- http_req_failed.value도 둘 다 0이라 요청 실패율은 사실상 없음
