import http from "@/utils/request";
import {
  Family,
  FamilyAvatarUrl,
  FamilyInformation,
  FamilyLoginCode,
  FamilyRefreshToken,
  FamilyUserinfo,
  ResponseData,
} from "./types/models";

/**
 * 登录
 *
 * @param {FamilyLoginCode} params
 * @return {*}
 */
export const requestLogin = (params: FamilyLoginCode) => {
  return http.request<ResponseData<Family>>({
    url: `family/login`,
    method: "POST",
    params: {},
    data: params,
    custom: { noAuth: true },
  });
};

/**
 * 刷新 token
 *
 * @param {FamilyRefreshToken} params
 * @return {*}
 */
export const requestRefreshToken = (params: FamilyRefreshToken) => {
  return http.request<ResponseData<object>>({
    url: `family/refresh`,
    method: "POST",
    params: {},
    data: params,
    custom: { noAuth: true },
  });
};

/**
 * 获取个人信息
 *
 * @return {*}
 */
export const requestGetUserInfo = () => {
  return http.request<ResponseData<Family>>({
    url: `family`,
    method: "GET",
    params: {},
    data: {},
  });
};

/**
 * 绑定手机
 *
 * @param {FamilyInformation} params
 * @return {*}
 */
export const requestBindPhone = (params: FamilyInformation) => {
  return http.request<ResponseData<object>>({
    url: `family/phone`,
    method: "POST",
    params: {},
    data: params,
  });
};

/**
 * 修改个人信息
 *
 * @param {{
 *   avatarUrl?: string;
 *   city?: string;
 *   country?: string;
 *   name?: string;
 *   nickName?: string;
 *   province?: string;
 *   sex?: number;
 * }} params
 * @return {*}
 */
export const requestUpdateInformation = (data: {
  avatarUrl?: string;
  city?: string;
  country?: string;
  name?: string;
  nickName?: string;
  province?: string;
  sex?: number;
}) => {
  return http.request<ResponseData<object>>({
    url: `family/info`,
    method: "PUT",
    params: {},
    data: data,
  });
};

/**
 * 更换头像
 *
 * @param {FamilyAvatarUrl} params
 * @return {*}
 */
export const requestUpdateAvatar = (params: FamilyAvatarUrl) => {
  return http.request<ResponseData<string>>({
    url: `family/avatar`,
    method: "PUT",
    params: {},
    data: params,
  });
};

/**
 * 用微信用户信息初始化用户资料
 *
 * @param {FamilyUserinfo} params
 * @return {*}
 */
export const requestUpdateWechatUserInfo = (params: FamilyUserinfo) => {
  return http.request<ResponseData<object>>({
    url: `family/userinfo`,
    method: "POST",
    params: {},
    data: params,
  });
};
