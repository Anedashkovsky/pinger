type TCallback = () => void;

export class ShutdownHandler {
  static instance: ShutdownHandler;

  static getInstance(): ShutdownHandler {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ShutdownHandler();

    return this.instance;
  }

  constructor() {
    this.initShutdownListeners();
  }

  private callbacks: TCallback[] = [];

  public attachCallback(callback: TCallback): void {
    this.callbacks.push(callback);
  }

  private onShutdown(): void {
    for (const callback of this.callbacks) {
      try {
        callback();
      } catch (error) {
        console.log(`Error ${error} occurred at executing shutdown callback`);
      }
    }

    process.exit(0);
  }

  private initShutdownListeners(): void {
    process.on("SIGINT", () => this.onShutdown());
    process.on("SIGTERM", () => this.onShutdown());
  }
}
