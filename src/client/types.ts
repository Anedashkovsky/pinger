export type TClientConfig = {
  pollInterval: number;
  pollAddress: string;
  pollTimeout: number;
  reportEndpoint: string;
  reportTimeout: number;
};

export type TStatisticData = {
  pingId: number;
  deliveryAttempt: number;
  date: number;
  responseTime: number;
};
