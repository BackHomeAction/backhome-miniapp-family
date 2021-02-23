import http from "@/utils/request";
import { ResponseData } from "./types/models";

/**
 * 发送短信验证码通用接口
 *
 * @param {string} api
 * @param {{ phone: string }} params
 * @return {*}
 */
export const requestGetCode = (api: string, params: { phone: string }) => {
  return http.request<ResponseData<object>>({
    url: api,
    method: "GET",
    params: params,
    data: {},
  });
};

/**
 * 上传图片
 *
 * @param {FormData} params
 * @return {*}
 */
export const requestUploadImage = (filePath: string) => {
  return http.upload<ResponseData<string>>(`family/photo`, {
    filePath,
    name: "photo",
  });
};
