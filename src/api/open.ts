import http from "@/utils/request";
import { Case, ResponseData } from "./types/models";

/**
 * 通过ID查询案件
 *
 * @param {{ caseId: number }} params
 */
export const requestGetCaseByID = (params: { caseId: number }) =>
  http.request<ResponseData<Case>>({
    url: `thirdParty/case/id`,
    method: "GET",
    params: params,
    data: {},
    custom: { noAuth: true },
  });
