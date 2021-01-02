import axios from "axios";

export function request(Incoming) {
  const api = axios.create({
    baseURL: "/api",
    method: Incoming.method || Incoming.get,
    data: Incoming.data,
  });

  return api(Incoming);
}
// api.interceptors.request.use((Incoming) => Incoming);
// api.interceptors.response.use((res) => res.data);
