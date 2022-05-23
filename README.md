# Client and server for check site availability

## Prerequisites

- node 16.15.0
- npm 8.5.5

## Dependency installation

```sh
npm ci
```

## Build scripts

Compile both client and server

```sh
npm run build
```

## Start scripts

Please start server first, than client

### Server

```sh
npm run server
```

### Client

```sh
npm run client
```

## Terminating

Both client and server can be terminated by pressing `ctrl-c` in console where they run, or by commands:

```sh
kill %PID%
```

```sh
kill -s SIGTERM %PID%
```

where `%PID%` - is a process pid. After receive this signal statistic report according of type (client or server) be printed.

## To start apps

1. Clone repository
2. Install dependencies `npm ci`
3. Build client and server `npm run build`
4. Start server `npm run start server`
5. Start client `npm run start client`
