export type HttpRequestEntity = {
  url: string;
  method: HttpMethodEntity;
  body?: any;
  headers?: any;
};

export type HttpMethodEntity = "post" | "get" | "put" | "delete" | string;

export enum HttpStatusCodeEnum {
  ok = 200,
  noContent = 204,
  badRequest = 400,
  unauthorized = 401,
  forbidden = 403,
  notFound = 404,
  serverError = 500,
}

export type HttpResponseEntity<T = any> = {
  statusCode: HttpStatusCodeEnum;
  body?: T;
};
