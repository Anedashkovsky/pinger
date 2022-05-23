import { request as httpsRequest, RequestOptions } from "https";
import { IncomingMessage, request as httpRequest } from "http";

import { URL } from "url";

import { EHttpMethod, EProtocol, EStatusCode } from "../lib/constants";
import { TStatisticData } from "./types";
import { HttpError, TimeoutError } from "./error";

type TResponse = {
  responseTime: number;
  data?: string;
  statusCode?: number;
};

export class RequestMaker {
  private readonly pingEndpoint: URL;

  private readonly uploadDataEndpoint: URL;

  constructor(
    pingEndpoint: string,
    uploadDataEndpoint: string,
    private readonly uploadTimeout: number
  ) {
    this.pingEndpoint = new URL(pingEndpoint);
    this.uploadDataEndpoint = new URL(uploadDataEndpoint);
  }

  public async ping(): Promise<TResponse["responseTime"]> {
    const { responseTime } = await this.makeRequest(this.pingEndpoint);

    return responseTime;
  }

  public async uploadData(body: TStatisticData): Promise<TResponse> {
    return this.makeRequest(
      this.uploadDataEndpoint,
      {
        timeout: this.uploadTimeout,
        method: EHttpMethod.POST,
      },
      body
    );
  }

  private async makeRequest(
    url: URL,
    params: RequestOptions = {},
    body?: Record<string, any>
  ): Promise<TResponse> {
    const request = this.selectRequestFunction(url);

    return new Promise((resolve, reject) => {
      const startTime: number = Date.now();
      let firstByteTime: number;
      const req = request(url, params, (response: IncomingMessage) => {
        const data: Buffer[] = [];

        response.once("data", () => {
          firstByteTime = Date.now();
        });

        response.on("data", (chunk: Buffer) => {
          data.push(chunk);
        });

        response.on("end", () => {
          const responseTime = firstByteTime - startTime;
          const { statusCode = EStatusCode.INTERNAL_SERVER_ERROR } = response;
          const responseData = Buffer.concat(data).toString();
          if (statusCode >= 400) {
            reject(new HttpError(statusCode, responseData));
          }

          resolve({
            responseTime,
            statusCode: response.statusCode,
            data: responseData,
          });
        });
      });

      req.on("error", (error) => reject(error));

      req.on("timeout", () => reject(new TimeoutError()));

      if (body) {
        req.write(JSON.stringify(body));
      }

      req.end();
    });
  }

  private selectRequestFunction(
    url: URL
  ): typeof httpRequest | typeof httpsRequest {
    const { protocol = EProtocol.HTTP } = url;

    if (protocol === EProtocol.HTTP) {
      return httpRequest;
    }

    if (protocol === EProtocol.HTTPS) {
      return httpsRequest;
    }

    throw new Error(`Unknown protocol ${protocol}`);
  }
}
