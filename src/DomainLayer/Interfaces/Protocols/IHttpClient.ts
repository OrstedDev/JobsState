import {
  HttpRequestEntity,
  HttpResponseEntity,
  HttpMethodEntity,
  HttpStatusCodeEnum,
} from "../../Models/Protocols/HttpClientEntity";

export interface IHttpClient {
  QueryRequest: (data: IHttpClient.NsHttpRequest) => Promise<IHttpClient.NsHttpResponse>;
}

export namespace IHttpClient {
  export type NsHttpStatusCode = HttpStatusCodeEnum;
  export type NsHttpMethod = HttpMethodEntity;
  export type NsHttpRequest = HttpRequestEntity;
  export type NsHttpResponse = HttpResponseEntity;
}
