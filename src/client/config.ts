import { TClientConfig } from "./types";

export const config: TClientConfig = {
  pollInterval: 1000,
  pollTimeout: 10000,
  pollAddress: "https://fundraiseup.com/",
  reportEndpoint: "http://localhost:8080/data",
  reportTimeout: 10000,
};
