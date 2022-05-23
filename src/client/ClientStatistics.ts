import { ShutdownHandler } from "../lib/ShutdownHandler";

export class ClientStatistics {
  private static instance: ClientStatistics;

  static getInstance(): ClientStatistics {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new ClientStatistics();
    return this.instance;
  }

  private requestsCount: number = 0;
  private timeoutCount: number = 0;
  private errorCount: number = 0;
  private successCount: number = 0;

  constructor() {
    ShutdownHandler.getInstance().attachCallback(this.printReport.bind(this));
  }

  public printReport() {
    console.log(`Client statistics report: \
requests count: ${this.requestsCount};\
success count: ${this.successCount};\
timeout count: ${this.timeoutCount};\
error count: ${this.errorCount};`);
  }

  public logError(): void {
    this.increaseRequests();
    this.errorCount++;
  }

  public logSuccess(): void {
    this.increaseRequests();
    this.successCount++;
  }

  public logTimeout(): void {
    this.increaseRequests();
    this.timeoutCount++;
  }

  private increaseRequests(): void {
    this.requestsCount++;
  }
}
