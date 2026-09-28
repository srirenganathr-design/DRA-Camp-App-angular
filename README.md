# DRA-Camp-App-angular

Angular greenfield port of the [DRA Camp App](https://github.com/srirenganathr-design/DRA-Camp-App) (React). See [docs/SOURCE.md](docs/SOURCE.md) for the React baseline.

## Stack

- Angular 19 (standalone, signals store)
- Domain layer ported from React (`src/app/data`, `utils`, `store`)
- Playwright Figma parity tests (ported; most fail until UI is rebuilt)

## Commands

```bash
npm install
npm start          # http://localhost:4200
npm run build
npm run test:e2e   # Playwright (after browsers installed)
```

## Branch workflow

- `main` — integration / deployable scaffold
- `feature/*` — vertical slices (e.g. `feature/patients-list`)

## Status

**Branch `feature/patients-list`:** Patients home UI (list, filters, cards, bottom nav, time-range sheet). Playwright parity partially met — still need camp picker, date-range picker, phone verification sheet, and detail/schedule screens for full `patients-parity.spec.ts`.

Push to GitHub: create `DRA-Camp-App-angular` on GitHub, then `git remote add origin … && git push -u origin main && git push origin feature/patients-list`.
