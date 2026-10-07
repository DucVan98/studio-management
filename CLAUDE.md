# Studio Management — Development Guide

React Native (Expo SDK 56) app following **Clean Architecture** principles.

## Quick Start

```bash
pnpm install
pnpm start          # Expo dev server
pnpm typecheck      # TypeScript check
pnpm lint           # ESLint
```

## Architecture

```
presentation (screens, components, navigation)
      │ import ▼
   domain (entities, usecases, repositories[interface], errors)  ← CORE
      ▲ implement ▲
   data (datasources, repositories[impl], mappers)
      │
   http / services (infrastructure)
```

**Rule:** Dependencies flow inward only. `domain` must NOT import from outer layers.

## Tech Stack

- **Framework**: React Native + Expo SDK 56
- **Navigation**: React Navigation v7
- **State (remote)**: TanStack Query v5 → `src/queries/`
- **State (local)**: Legend-State v3 → `src/stores/`
- **Styling**: NativeWind v4 + Tailwind
- **i18n**: i18next + react-i18next
- **HTTP**: Custom HttpClient wrapper in `src/http/`
- **DI**: Manual DIContainer in `src/di/`

## Directory Structure

```
src/
├── components/ui/      # Reusable UI components
├── config/             # App config (links, constants)
├── di/                 # DIContainer
├── http/               # HTTP client wrapper
├── i18n/               # Internationalization
├── navigation/         # React Navigation
├── screens/            # Feature screens
├── services/           # 3rd-party adapters
└── tokens/             # Design tokens (colors, spacing)
```

## Conventions

### Dependency Injection
- Register all dependencies in `DIContainer.ts`
- Inject via constructor, don't create instances inline
- One instance per dependency (singleton pattern)

### Domain Layer (src/domain/)
- **Entities**: Pure data objects (User, Memory, etc)
- **Use Cases**: Business logic (`execute(input) → output`)
- **Repositories**: Interfaces only (`IXxxRepository`)
- **Errors**: Throw `AppError` with kind codes

### Data Layer (src/data/)
- **DataSources**: HTTP calls, raw data fetch
- **Repositories**: Implement `IXxxRepository`, map DTO→Entity
- **Mappers**: Convert between DTO and Entity
- **Types**: API DTOs (from backend contract)

### 3rd-Party Libraries (src/services/)
- **DO**: Wrap every 3rd-party lib in adapter/service
- **DON'T**: Import libraries directly in screens/usecases
- Define app-specific interface, one impl per library
- Map library errors to `AppError`

Example:
```typescript
// ✅ DO
export interface ISecureStorage {
  save(key: string, value: string): Promise<void>;
  load(key: string): Promise<string | null>;
}

export class ExpoSecureTokenStorage implements ISecureStorage {
  async save(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);  // Only here
  }
}

// ❌ DON'T
import * as SecureStore from 'expo-secure-store';  // Don't import in screens
```

### Styling
- Use `className` + design tokens from `tailwind.config.ts`
- NO `StyleSheet.create()` or inline styles
- Token examples: `bg-accent`, `text-body-md`, `rounded-pill`

### i18n
- All user-facing strings must exist in BOTH locales
- Files: `src/i18n/locales/en.ts` and `vi.ts`
- Use: `const { t } = useTranslation()`

## When Adding a Feature

1. **Define entity** in `src/domain/entities/XxxEntity.ts`
2. **Write use case** in `src/domain/usecases/xxx/XxxUseCase.ts`
3. **Create repository interface** in `src/domain/repositories/IXxxRepository.ts`
4. **Implement data layer**:
   - Datasource interface + impl
   - Repository impl + mapper
5. **Register in DIContainer** → `getXxxUseCase()`
6. **Build query hook** in `src/queries/hooks/xxx.queries.ts`
7. **Build screen** in `src/screens/xxx/XxxScreen.tsx`
8. **Add i18n** strings to en.ts + vi.ts
9. **Run checks**: `pnpm typecheck && pnpm lint`

## TypeScript

- Strict mode enabled (`strict: true`)
- NO `any` type
- Use `import type` for type imports
- Define interfaces for all component props

## Testing

```bash
pnpm test
```

Test domain layer (usecases, entities). Mock repositories via interface, not implementations.

## Useful Commands

```bash
pnpm start                  # Dev server
pnpm ios / pnpm android    # Build & run
pnpm typecheck              # TS check (run often!)
pnpm lint                   # ESLint + Prettier
pnpm lint:check             # ESLint check only (CI)
pnpm test                   # Jest
```
