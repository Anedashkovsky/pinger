import { ShutdownHandler } from "../lib/ShutdownHandler";

export class Statistics {
  private responseTimes: number[] = [];

  constructor(private readonly name: string) {
    ShutdownHandler.getInstance().attachCallback(this.printReport.bind(this));
  }

  public addTime(time: number): void {
    if (Number.isNaN(time)) {
      return;
    }

    this.responseTimes.push(time);
  }

  public printReport() {
    const averageTime = this.calculateAverageTime();
    const medianTime = this.calculateMedianTime();

    console.log(
      `${this.name} report:\naverage response time: ${averageTime}.\nmedian response time: ${medianTime}`
    );
  }

  private calculateMedianTime(): number {
    const { responseTimes } = this;
    if (!this.responseTimes.length) {
      return 0;
    }

    responseTimes.sort();
    const { length } = responseTimes;

    const middle = Math.floor(length / 2);
    if (length % 2 === 0) {
      const middleLeft = responseTimes[middle - 1];
      const middleRight = responseTimes[middle];

      return this.calculateAverage([middleLeft + middleRight]);
    }

    return responseTimes[middle];
  }

  private calculateAverageTime() {
    return this.calculateAverage(this.responseTimes);
  }

  private calculateAverage(array: number[]): number {
    if (!array.length) {
      return 0;
    }

    const sum = array.reduce((result, current) => {
      result += current;

      return result;
    });

    return sum / array.length;
  }
}
