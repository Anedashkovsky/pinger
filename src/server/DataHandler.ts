import { ServerResponse } from "http";

import { EStatusCode } from "../lib/constants";
import { THandlerParams } from "./types";

import { Statistics } from "./Statistics";

enum EResponseType {
  SUCCESS,
  ERROR,
  STUCK,
}

export class DataHandler {
  private readonly statistics: Statistics = new Statistics("Received data");

  public handle({ request: _request, response, data }: THandlerParams): void {
    const responseType = this.getResponseType();

    if (responseType === EResponseType.SUCCESS) {
      return this.successResponse(response, data);
    }

    if (responseType === EResponseType.ERROR) {
      return this.errorResponse(response);
    }

    if (responseType === EResponseType.STUCK) {
      return this.stuckResponse();
    }

    throw Error("Unknown response type");
  }

  private successResponse(
    response: ServerResponse,
    data?: Record<string, any>
  ): void {
    if (!data) {
      throw new Error("No data transferred");
    }

    const { responseTime } = data;
    const normalizedResponseTime = Number(responseTime);
    this.statistics.addTime(normalizedResponseTime);

    console.log(data);
    response.end("OK");
  }

  private errorResponse(response: ServerResponse): void {
    response.statusCode = EStatusCode.INTERNAL_SERVER_ERROR;
    response.end();
  }

  private stuckResponse(): void {}

  private getResponseType(): EResponseType {
    const rndNumber = Math.random();

    if (rndNumber <= 0.2) {
      return EResponseType.STUCK;
    }

    if (rndNumber > 0.2 && rndNumber <= 0.4) {
      return EResponseType.ERROR;
    }

    return EResponseType.SUCCESS;
  }
}
