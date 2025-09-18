# Mesa PWA

Mesa PWA is an Ionic + Angular application that demonstrates a responsive task planner powered by NgRx entity state. The app is installable as a progressive web app and persists data locally so you can seamlessly pick up where you left off.

## Getting started

```bash
npm install
npm start
```

The development server is available at `http://localhost:4200/`.

## Available scripts

- `npm start` - Run the development server with live reload.
- `npm run build` - Build the application for production.
- `npm run lint` - Lint the project using the Angular CLI configuration.

## Features

- **Ionic UI** for mobile-first components that adapt across devices.
- **NgRx Store + Entity** to manage task collections with a reactive facade.
- **Local persistence** using the browser's storage to keep your tasks offline.
- **Progressive Web App** ready with service worker configuration and manifest.

## Project structure

```
src/
  app/
    pages/       Feature pages built with Ionic components
    services/    Reusable services (local persistence, etc.)
    store/       NgRx entity state, selectors, effects, and facade
  assets/        Static assets
  theme/         Ionic theming variables
```

## Responsive design

The layout adapts from single column on phones to a two-column dashboard on larger screens, ensuring an accessible experience everywhere.
