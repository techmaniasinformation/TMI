import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:8080";

export const options = {
  scenarios: {
    mixed_read_traffic: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "2m", target: 50 },   // warm-up
        { duration: "10m", target: 200 }, // steady
        { duration: "2m", target: 400 },  // spike
        { duration: "1m", target: 0 },    // cool-down
      ],
      gracefulRampDown: "30s",
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<800"],
  },
};

function get(path, endpointTag) {
  const res = http.get(`${BASE_URL}${path}`, {
    tags: { endpoint: endpointTag },
  });
  check(res, {
    "status is 200": (r) => r.status === 200,
  });
}

export default function () {
  const n = Math.random();

  // 60%: post list, 40%: popular
  if (n < 0.6) {
    get("/api/v1/post?page=1&size=10", "post_list");
  } else {
    get("/api/v1/post/popular?size=10", "post_popular");
  }

  sleep(0.2);
}
