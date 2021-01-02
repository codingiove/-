import { request } from "./index";
const get = "get";
export function GetBanner() {
  return request({
    url: "/banner",
    // method: get,
  });
}

export function PlayList() {
  return request({
    url: "/personalized",
    // method: get,
    params: {
      limit: 10,
    },
  });
}

export function LatestMusic() {
  return request({
    url: "/personalized/newsong",
    // method: get,
  });
}

export function PlayMusic(id) {
  return request({
    url: "/song/url",
    // method: get,
    params: {
      id,
    },
  });
}

export function BroaDcastMv() {
  return request({
    url: "/personalized/mv",
  });
}
