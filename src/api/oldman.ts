import http from "@/utils/request";
import { JavaList, OldMan, ResponseData } from "./types/models";

export const requestAddOldMan = (params: OldMan) => {
  return http.request<ResponseData<object>>({
    url: `family/oldMan`,
    method: "POST",
    params: {},
    data: params,
  });
};

export const requestGetOldMen = () => {
  return http.request<ResponseData<JavaList<OldMan>>>({
    url: `family/oldMan`,
    method: "GET",
    params: {},
    data: {},
  });
};
