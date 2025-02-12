import { IHttpClient } from "../../DomainLayer/Interfaces/Protocols/IHttpClient";
import axios, { AxiosResponse } from "axios";

export default class AxiosHttpClient implements IHttpClient {
  async QueryRequest(
    data: IHttpClient.NsHttpRequest
  ): Promise<IHttpClient.NsHttpResponse> {
    let axiosResponse: AxiosResponse;
    try {
      axiosResponse = await axios.request({
        url: data.url,
        method: data.method,
        data: data.body,
        headers: data.headers,
      });
    } catch (error: any) {
      axiosResponse = error.response;
    }
    return {
      statusCode: axiosResponse.status,
      body: axiosResponse.data,
    };
  }
}
