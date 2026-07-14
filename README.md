## 

This source code has been exported from [Caffeine](https://caffeine.ai/)

### Local Development

This project can be run locally with `dfx` (the standard DFINITY SDK) alongside
the existing `mops` + `pnpm` toolchain. No existing app behavior or backend
logic was changed — only configuration files (`dfx.json`, `src/frontend/env.json`,
and root `package.json` scripts) were added.

#### Prerequisites

- [dfx](https://internetcomputer.org/docs/current/developer-docs/setup/install/)
  (DFINITY SDK) on your PATH
- [mops](https://mops.one/) CLI for Motoko package management
- [pnpm](https://pnpm.io/) for the frontend workspace

#### One-time setup

```bash
pnpm setup
```

This runs `mops install` (backend Motoko deps) and `pnpm install` (frontend
workspace deps).

#### Start the local replica

```bash
pnpm local:start
```

Starts `dfx start` in the background bound to `127.0.0.1:4943` — the same port
the Vite dev-server proxy (`/api -> 127.0.0.1:4943`) already targets.

#### Deploy canisters locally

```bash
pnpm local:deploy
```

Runs `dfx deploy`, which builds the backend canister via `mops build` and
deploys the frontend as an `assets` canister serving `src/frontend/dist`.

After deploy, capture the backend canister id:

```bash
dfx canister id backend
```

#### Wire the frontend to the local replica

Open `src/frontend/env.json` and replace the placeholder
`REPLACE_WITH_BACKEND_CANISTER_ID` with the principal printed by the command
above. The file should look like:

```json
{
  "backend_host": "http://127.0.0.1:4943",
  "backend_canister_id": "<paste backend canister id here>",
  "project_id": "undefined",
  "ii_derivation_origin": null,
  "storage_gateway_url": "http://127.0.0.1:4943"
}
```

`backend_host` includes `localhost`/`127.0.0.1`, so
`core-infrastructure`'s `loadConfig()` automatically calls
`agent.fetchRootKey()` against the local replica — no code change required.

#### Regenerate frontend bindings (after backend API changes)

```bash
pnpm local:bindgen
```

Regenerates `src/frontend/src/declarations/backend.did.{js,d.ts}` and
`src/frontend/src/backend.{ts,d.ts}` from `src/backend/dist/backend.did`.

#### Run the frontend dev server

```bash
pnpm local:dev
```

Starts the Vite dev server for the frontend workspace with hot reload. The
dev server proxies `/api` requests to the local replica at `127.0.0.1:4943`.

### Coming Soon

We are working on tools to help you build locally and deploy your apps back to caffeine.
