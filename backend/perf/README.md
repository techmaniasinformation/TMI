# Redis Cache Load Test Guide

## 1) Prerequisites
- Redis running and reachable from this app (`spring.data.redis.host`, `spring.data.redis.port`)
- k6 installed
- App can start with `dev` profile

## 2) Run baseline (cache off)
1. Start app:
```powershell
$env:FEATURE_POST_VIEW_CACHE_ENABLED="false"
.\gradlew.bat bootRun
```
2. In another terminal, run k6:
```powershell
k6 run .\perf\k6\post-view-load.js --summary-export .\perf\results\before.json
```

## 3) Run cache scenario (cache on)
1. Restart app:
```powershell
$env:FEATURE_POST_VIEW_CACHE_ENABLED="true"
.\gradlew.bat bootRun
```
2. In another terminal, run k6:
```powershell
k6 run .\perf\k6\post-view-load.js --summary-export .\perf\results\after.json
```

## 4) Generate report
```powershell
.\perf\scripts\generate-report.ps1
```

Output file:
- `.\perf\results\report.md`

## 5) Optional env vars for k6
- `BASE_URL` (default: `http://localhost:8080`)
- `POST_IDS` comma-separated post ids used for detail API (default: `1,2,3,4,5`)

Example:
```powershell
$env:BASE_URL="http://localhost:8080"
$env:POST_IDS="10,11,12,13,14"
k6 run .\perf\k6\post-view-load.js --summary-export .\perf\results\before.json
```
