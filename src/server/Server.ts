import { createServer, IncomingMessage, Server, ServerResponse } from "http";

import { EHttpMethod, EStatusCode } from "../lib/constants";

import { TServerConfig, THandler } from "./types";

import { DataHandler } from "./DataHandler";

type TAttachHandlerParams = {
  method: EHttpMethod;
  path: string;
  handler: THandler;
};

export class ServerWrapper {
  private readonly server: Server;
  private handlerMap: Map<string, THandler> = new Map();

  constructor(private readonly config: TServerConfig) {
    this.server = createServer(this.requestListener.bind(this));

    const dataHandler = new DataHandler();
    this.attachHandler({
      method: EHttpMethod.POST,
      path: "/data",
      handler: dataHandler.handle.bind(dataHandler),
    });
  }

  public attachHandler({ method, path, handler }: TAttachHandlerParams): void {
    const routeHash = this.buildRouteHash(path, method);

    if (this.handlerMap.has(routeHash)) {
      throw new Error("Route already initialized");
    }

    this.handlerMap.set(routeHash, handler);
  }

  public start(): void {
    if (!this.server) {
      throw new Error("Server must be initialized before");
    }

    if (!this.config) {
      throw new Error("Specifying config is necessary");
    }

    const { host, port } = this.config;
    this.server.listen(port, host, () => {
      console.log(`Server started and listen on ${host}:${port}`);
    });
  }

  private async requestListener(
    request: IncomingMessage,
    response: ServerResponse
  ): Promise<void> {
    const { url, method } = request;

    if (!url || !method) {
      response.statusCode = EStatusCode.NOT_FOUND;
      response.end();

      return;
    }

    const handler = this.selectHandler(url as string, method as EHttpMethod);
    if (!handler) {
      response.statusCode = EStatusCode.NOT_FOUND;
      response.end();

      return;
    }

    const data = await this.extractPayload(request);
    await handler({
      request,
      response,
      data,
    });
  }

  private selectHandler(
    path: string,
    method: EHttpMethod
  ): THandler | undefined {
    const routeHash = this.buildRouteHash(path, method);

    return this.handlerMap.get(routeHash);
  }

  private buildRouteHash(path: string, method: EHttpMethod): string {
    return `${method}:${path}`;
  }

  private extractPayload(
    request: IncomingMessage
  ): Promise<Record<string, any> | undefined> {
    return new Promise((resolve, reject) => {
      let chunks: Buffer[] = [];
      request.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });
      request.on("end", () => {
        if (!chunks.length) {
          resolve(undefined);
        }

        try {
          const message = Buffer.concat(chunks);
          const jsonPayload = JSON.parse(message.toString());

          resolve(jsonPayload);
        } catch (error) {
          reject(error);
        }
      });
      request.on("error", reject);
    });
  }
}
