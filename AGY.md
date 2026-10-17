# @ostro/cache — Antigravity AI Architecture & Knowledge Base

> **Package Name**: `@ostro/cache`
> **Version**: `2.0.0-alpha.1`
> **Role in Ecosystem**: Modular Core Framework Library

---

## 1. Package Purpose & Overview
High-performance multi-store caching system supporting file, memory, redis, memcached, and database storage engines.

- **Primary Architectural Patterns**: Repository pattern, taggable stores, atomic locks, rate limiting sliding window.
- **Key Exported Entities**: `CacheManager`, `Repository`, `CacheAdapter`, `RateLimiter`

---

## 2. Dependencies & Interoperability
- **Direct Dependencies**:
  - `@ostro/support`: `^1.0.11`
  - `bluebird`: `^3.7.2`
  - `fs-extra`: `^10.0.0`
- **Framework Consumers**: Consumed across the OstroJS ecosystem via `@ostro/framework` and direct imports.

---

## 3. Directory & Source Layout
```text
origin/cache/
├── adapter/StoreHelper.ts
├── adapter/database.ts
├── adapter/file.ts
├── adapter/memcached.ts
├── adapter/memory.ts
├── adapter/null.ts
├── adapter/redis.ts
├── cacheAdapter.ts
├── cacheManager.ts
├── cacheServiceProvider.ts
├── client/memcached.ts
├── client/redis.ts
├── console/cacheTableCommand.ts
├── console/clearCommand.ts
├── console/forgetCommand.ts
├── rateLimiter.ts
├── rateLimiting/globalLimit.ts
├── rateLimiting/limit.ts
├── rateLimiting/unlimited.ts
├── utils.ts
```

---

## 4. TypeScript Typing & Code Standards
1. **Access Modifiers**: All class properties and methods declare explicit visibility (`public`, `protected`, `private`).
2. **Inheritance & Overrides**: Classes overriding base class methods use the `override` keyword to safeguard contracts.
3. **Immutability**: Constant lookup tables and static registries use `readonly` and strict record types.
4. **No Implicit Any**: Public APIs avoid `any` in favor of generics (`<T = unknown>`) and typed contracts from `@ostro/contracts`.
5. **Contract Binding**: Core managers implement contracts from `@ostro/contracts/cache/*`.

---

## 5. Development & Verification Guide
- **Compile / Build**: `npm run build` (runs `rm -rf build && npx tsc -p tsconfig.build.json`)
- **Run Tests**: `npm test` (executes Jest with 100% coverage target via `c8`)
- **Published Artifacts**: Target output compiled to `./build` with accompanying `.d.ts` declarations and source maps.

---
*Generated for Antigravity AI high-speed codebase comprehension with minimal token consumption.*
