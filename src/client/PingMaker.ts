import { DataUploader } from "./DataUploader";
import { RequestMaker } from "./requestMaker";

export class PingMaker {
  private pingId: number = 0;

  constructor(
    private readonly pollInterval: number,
    private readonly requestMaker: RequestMaker
  ) {}

  public start() {
    setInterval(this.poll.bind(this), this.pollInterval);
  }

  private async poll(): Promise<void> {
    this.pingId++;
    try {
      const pingdate = Date.now();
      const { requestMaker } = this;

      const responseTime = await requestMaker.ping();

      const uploader = new DataUploader(requestMaker, {
        date: pingdate,
        responseTime,
        pingId: this.pingId,
      });

      uploader.upload();
    } catch (error) {
      console.log(`error at ping request occurred`, error);
    }
  }
}
