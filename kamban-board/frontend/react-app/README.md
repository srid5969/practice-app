# Kamban Board

A Kanban-style task management board built with React and TypeScript. This project demonstrates modern React patterns, state management, and drag-and-drop functionality.

## Features

- Create, view, and manage boards, columns, and tasks
- Drag-and-drop tasks between columns
- State management with Redux Toolkit
- TypeScript for type safety
- Vite for fast development and build
- Modular and scalable folder structure

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Installation

```bash
npm install
# or
yarn install
```

### Running the App

```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:5173`.

## Project Structure

```
react-app/
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
├── vite-env.d.ts
├── vite.config.ts
├── public/
│   └── fav-icon.svg
└── src/
  ├── App.css
  ├── App.tsx
  ├── index.css
  ├── main.tsx
  ├── app/
  │   ├── hooks.ts
  │   └── store.ts
  ├── assets/
  │   └── react.svg
  ├── configurations/
  │   └── configs.ts
  ├── features/
  │   ├── boards/
  │   │   ├── BoardList.tsx
  │   │   ├── BoardPage.tsx
  │   │   └── boardsSlice.ts
  │   ├── columns/
  │   │   ├── Column.tsx
  │   │   └── columnsSlice.ts
  │   └── tasks/
  │       ├── TaskCard.tsx
  │       └── tasksSlice.ts
  ├── pages/
  │   ├── boards/
  │   │   └── index.tsx
  │   ├── dashboard/
  │   │   └── index.tsx
  │   └── non-found/
  │       └── index.tsx
  └── utils/
    ├── api.service.ts
    ├── constants.ts
    └── dndHelpers.ts
```

## License

This project is licensed under the MIT License.