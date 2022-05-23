import { config } from "./config";
import { ServerWrapper } from "./Server";

// const handlePayload = (
//   request: IncomingMessage
// ): Promise<Record<string, string> | undefined> => {
//   return new Promise((resolve, reject) => {
//     let chunks: Buffer[] = [];
//     request.on("data", (chunk: Buffer) => {
//       chunks.push(chunk);
//     });
//     request.on("end", () => {
//       if (!chunks.length) {
//         resolve(undefined);
//       }

//       try {
//         const message = Buffer.concat(chunks);
//         const jsonPayload = JSON.parse(message.toString());

//         resolve(jsonPayload);
//       } catch (error) {
//         reject(error);
//       }
//     });
//     request.on("error", reject);
//   });
// };

// const server = createServer(
//   async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
//     const { url, method } = request;

//     const data = await handlePayload(request);
//     console.log(data);
//   }
// );

// const { host, port } = config;

// server.listen(port, host, () => {
//   console.log(`Server started and listen on ${host}:${port}`);
// });

const server = new ServerWrapper(config);
server.start();
