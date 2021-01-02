import { request } from "./index";
export function searchkey(keywords,type) {
  return request({
    url: "/search",
    params: {
      type,
      limit: 24,
      keywords,
    },
  });
}
