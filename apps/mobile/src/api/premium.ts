import { http } from "../lib/http";

export const premiumRequest = {
  getTypes: () => http.get("/api/premium/types"),
  purchase: (body: { premiumTypeId: string }) =>
    http.post("/api/premium/purchase", body),
  getMyStatus: () => http.get("/api/premium/my-status"),
};

