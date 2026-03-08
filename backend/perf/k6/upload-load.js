import http from 'k6/http';
import { check, sleep } from 'k6';
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';

const BASE_URL = __ENV.BASE_URL || "http://localhost:8080";

export const options = {
    scenarios: {
        upload_exhaustion_test: {
            executor: "ramping-vus",
            startVUs: 0,
            stages: [
                { duration: "10s", target: 50 },  // 50 VUs (to test HikariCP max-connections 10)
                { duration: "20s", target: 50 },  // trigger connection pool wait and timeout
                { duration: "5s", target: 0 },
            ],
            gracefulRampDown: "5s",
        },
    },
    thresholds: {
        http_req_failed: ["rate<0.05"], // Expect high failures (500/timeout) BEFORE fix.
    },
};

// Create a dummy file payload as a binary representation
const dummyThumbnail = new Uint8Array(1024 * 50).buffer; // 50KB dummy

export default function () {
    const fd = new FormData();

    // Spring `PostCreateRequest` Json parsing
    const postCreateRequest = JSON.stringify({
        memberId: 1, // 테스트 유저
        title: `Post Title ${Math.random()}`,
        link: "http://example.com",
        content: "Test Content for upload performance",
        tags: ["test", "k6"]
    });

    // Attach JSON
    fd.append("postCreateRequest", http.file(postCreateRequest, "data.json", "application/json"));

    // Attach File
    fd.append("thumbnailImage", http.file(dummyThumbnail, "dummy.jpg", "image/jpeg"));

    const params = {
        headers: {
            "Content-Type": `multipart/form-data; boundary=${fd.boundary}`
        },
        // Enforcing tag format for our K6 rules
        tags: { endpoint: "post_create_with_upload" },
    };

    const res = http.post(`${BASE_URL}/api/v1/post`, fd.body(), params);

    check(res, {
        "post creation status is 200": (r) => r.status === 200,
    });

    sleep(0.5); // Short wait
}
