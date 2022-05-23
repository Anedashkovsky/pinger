import { ClientStatistics } from "./ClientStatistics";
import { HttpError, TimeoutError } from "./error";
import { RequestMaker } from "./requestMaker";
import { TStatisticData } from "./types";

type TBackOffParams = {
  backoffBase: number;
  maxDelay: number;
  jitterBase: number;
};

const wait = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

type TUploadData = Omit<TStatisticData, "deliveryAttempt">;

const DEFAULT_BACKOFF_PARAMS: TBackOffParams = {
  backoffBase: 2,
  jitterBase: 1000,
  maxDelay: 50000,
};

export class DataUploader {
  private statistics = ClientStatistics.getInstance();

  private currentDeliveryAttempt: number = 0;

  private backoffParams: TBackOffParams;

  constructor(
    private readonly requestMaker: RequestMaker,
    private readonly data: TUploadData,
    params?: Partial<TBackOffParams>
  ) {
    this.backoffParams = {
      ...DEFAULT_BACKOFF_PARAMS,
      ...params,
    };
  }

  public async upload(): Promise<void> {
    try {
      const body: TStatisticData = {
        ...this.data,
        deliveryAttempt: this.currentDeliveryAttempt,
      };
      console.log(`Try to send ${JSON.stringify(body)} to server`);
      const response = await this.requestMaker.uploadData(body);
      console.log(
        `Success response: status code: ${response.statusCode}; response: ${response.data}`
      );

      this.statistics.logSuccess();
    } catch (error) {
      this.logError(error);

      const delay = this.calculateBackoffDelay();
      this.currentDeliveryAttempt++;
      this.retryUpload(delay);
    }
  }

  private logError(error: unknown): void {
    if (error instanceof TimeoutError) {
      this.statistics.logTimeout();
      console.log("Timeout error");

      return;
    }
    if (error instanceof HttpError) {
      console.log(
        `Http error: status code ${error.getStatusCode()}; response: ${error.getResponse()}`
      );
      this.statistics.logError();

      return;
    }

    console.log(`Unknown error`, error);
  }

  private async retryUpload(time: number): Promise<void> {
    await wait(time);
    this.upload();
  }

  private calculateBackoffDelay(): number {
    const { backoffParams, currentDeliveryAttempt } = this;
    const { backoffBase, maxDelay, jitterBase } = backoffParams;

    // Random milliseconds amount depending of jitter base
    const jitter = Math.round(Math.random() * jitterBase);
    // Delay in milliseconds, depending of current delivery attempt
    const exponentialDelay =
      Math.pow(backoffBase, currentDeliveryAttempt) * 1000;

    const calculatedDelay = exponentialDelay + jitter;

    return Math.min(calculatedDelay, maxDelay);
  }
}
