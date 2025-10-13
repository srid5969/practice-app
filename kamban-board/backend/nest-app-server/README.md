# Nest App Server

This is the backend server for the React Practice App, built with [NestJS](https://nestjs.com/). It provides RESTful APIs for managing boards, columns, and tasks.

## Project Structure

```
nest-app-server/
├── .env                  # Environment variables
├── .gitignore
├── .prettierrc           # Prettier config
├── eslint.config.mjs     # ESLint config
├── nest-cli.json         # Nest CLI config
├── package.json
├── README.md
├── tsconfig.build.json
├── tsconfig.json
├── src/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── main.ts
│   ├── board/
│   │   ├── board.module.ts
│   │   └── schemas/
│   │       └── board.schema.ts
│   ├── columns/
│   │   ├── columns.module.ts
│   │   └── schemas/
│   │       └── columns.schema.ts
│   ├── configuration/
│   │   └── config.ts
│   └── task/
│       ├── task.module.ts
│       └── schemas/
│           └── tasks.schema.ts
└── test/
  ├── app.e2e-spec.ts
  └── jest-e2e.json
```

## Features

- **Boards**: Create and manage boards.
- **Columns**: Organize tasks within columns.
- **Tasks**: CRUD operations for tasks.
- **Configuration**: Centralized config management.
- **Testing**: Includes e2e tests with Jest.

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm

### Installation

```bash
npm install
```

### Running the Server

```bash
npm run start:dev
```

The server will start using the configuration in `.env`.

### Testing

```bash
npm run test
npm run test:e2e
```

## Project Modules

- `board/`: Board-related logic and schemas.
- `columns/`: Columns logic and schemas.
- `task/`: Task logic and schemas.
- `configuration/`: App configuration.

## License

MIT
