import http from "@/utils/request";
import { OldMan, ResponseData } from "./types/models";

export const requestAddOldMan = (params: OldMan) => {
  return http.request<ResponseData<object>>({
    url: `family/oldMan`,
    method: "POST",
    params: {},
    data: params,
  });
};
