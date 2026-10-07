# Studio Management

React Native (Expo SDK 56) app - Clean Architecture boilerplate.

## Setup

```bash
pnpm install
cp .env.example .env
pnpm start
```

## Chạy trên thiết bị

```bash
pnpm ios       # iOS simulator
pnpm android   # Android emulator
```

## Commands

```bash
pnpm start      # Expo dev server
pnpm typecheck  # TypeScript check
pnpm lint       # ESLint
pnpm test       # Jest
```

## Structure

```
src/
├── components/   # UI components
├── config/       # Config files
├── di/           # Dependency injection
├── http/         # HTTP client
├── i18n/         # Internationalization
├── navigation/   # React Navigation
├── screens/      # Screens
├── services/     # 3rd-party adapters
└── tokens/       # Design tokens
```

See [CLAUDE.md](./CLAUDE.md) for architecture details.
