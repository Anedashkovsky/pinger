import { IncomingMessage, ServerResponse } from "http";

export type TServerConfig = {
  host: string;
  port: number;
};

export type THandlerParams = {
  request: IncomingMessage;
  response: ServerResponse;
  data: Record<string, any> | undefined;
};

export type THandler = (params: THandlerParams) => Promise<void> | void;
