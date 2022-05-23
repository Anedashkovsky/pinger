import { PingMaker } from "./PingMaker";
import { RequestMaker } from "./RequestMaker";
import { config } from "./config";

const { pollAddress, reportEndpoint, pollInterval, reportTimeout } = config;

const requestMaker = new RequestMaker(
  pollAddress,
  reportEndpoint,
  reportTimeout
);
const pingMaker = new PingMaker(pollInterval, requestMaker);

pingMaker.start();
