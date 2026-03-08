import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:8080";
const TARGET_POST_ID = 1;

export const options = {
    scenarios: {
        race_condition_test: {
            executor: "ramping-vus",
            startVUs: 0,
            stages: [
                { duration: "5s", target: 100 },  // spike up to 100 VUs
                { duration: "10s", target: 100 }, // hold at 100 VUs to trigger race condition
                { duration: "5s", target: 0 },    // ramp down
            ],
            gracefulRampDown: "5s",
        },
    },
    thresholds: {
        http_req_failed: ["rate<0.05"], // Allow some failures since we are testing concurrency issues
    },
};

export default function () {
    // 1. 게시글 상세 조회 테스트 (조회수 증가 Lost Update 확인용)
    const viewRes = http.get(`${BASE_URL}/api/v1/post/${TARGET_POST_ID}`, {
        tags: { endpoint: "post_detail_view" },
    });

    check(viewRes, {
        "post view status is 200": (r) => r.status === 200,
    });

    // 2. 게시글 별점(좋아요) 테스트 (스타 수 증가 Lost Update 확인용)
    // 스타는 동일 유저가 중복으로 누르면 실패할 수 있으므로, 
    // 동시성 테스트를 위해 memberId를 무작위로 생성하여 보냅니다.
    const randomMemberId = Math.floor(Math.random() * 10000) + 1;

    const payload = JSON.stringify({
        memberId: randomMemberId,
        postId: TARGET_POST_ID,
    });

    const params = {
        headers: {
            "Content-Type": "application/json",
        },
        tags: { endpoint: "post_star_register" },
    };

    const starRes = http.post(`${BASE_URL}/api/v1/star`, payload, params);

    check(starRes, {
        "star post status is 200 or 400": (r) => r.status === 200 || r.status === 400,
    });

    // 짧은 대기 시간으로 경쟁 상태 극대화
    sleep(0.01);
}
