# Predictive Modeling — reglas para agentes (Gentleman individual)

Resumen operativo para humanos y agentes de Cursor. Detalle: [README.md](./README.md), [docs/architecture.md](./docs/architecture.md), [docs/math_model.md](./docs/math_model.md).

## Proyecto

| Campo | Valor |
|-------|--------|
| Ruta local | `/home/magnetico/Nexus/Predictive_Modeling` |
| Dominio | Dashboard Liga Argentina · predicciones Dixon-Coles (Poisson) · análisis de apuestas |
| Jira | **PRODE** — [Predictive Modeling](https://feelibizaproperties.atlassian.net/jira/software/projects/PRODE) |
| Engram | Proyecto individual `predictive_modeling` (topic keys `predictive_modeling/*`); datos locales en `.engram/` |

## Stack

- **Backend:** Node.js (ESM), Express MVC, MongoDB (Mongoose Singleton), Zod, Helmet, sanitize-html, Jest
- **Frontend:** React 19 + Vite (proxy `/api`)
- **Datos externos:** API-Football v3 (`x-apisports-key`), liga ID **128**, temporada por defecto **2024**
- **Modelo:** Dixon-Coles sobre Poisson; calibración walk-forward de fuerzas A/D

## Pipeline de datos

```
POST /api/sync  →  teams + fixtures  →  calibrateStrengths  →  predictUpcoming
GET  /api/reports/backtest  →  walk-forward (mín. 5 partidos previos)
GET  /api/reports/export.csv  →  prob 1X2 + cuotas implícitas
```

## Trazabilidad Jira + estimación

- Cada módulo nuevo lleva comentario de cabecera: `PRODE-N` + **T-Shirt** (XS–XL).
- Clave Jira del proyecto: **PRODE** (no PM). Mapeo H1–H12 en `docs/architecture.md`.
- Commits/PR en español claro; referenciar ticket cuando aplique.

## Skills del repo

Instaladas en `.agents/skills/` (registry: `.atl/skill-registry.md`):

| Skill | Uso en este proyecto |
|-------|----------------------|
| `tdd` | Jest backend; vertical slices red→green→refactor |
| `improve-codebase-architecture` | Refactors; leer `docs/` antes de proponer seams |
| `nodejs-backend-patterns` | Express MVC, middleware, validación |
| `vercel-react-best-practices` | Rendimiento React en dashboard |

Skills globales Gentleman (Cursor): `branch-pr`, `issue-creation`, `work-unit-commits`, `cognitive-doc-design`.

## MCP (`.cursor/mcp.json`)

| Servidor | Uso |
|----------|-----|
| `engram` | Memoria persistente del proyecto (`predictive_modeling`, datos en `.engram/`) |
| `context7` | Documentación de librerías (Express, React, Mongoose, etc.) |

Jira/Atlassian: plugin global de Cursor (proyecto **PRODE**).

Tras editar `mcp.json`: **MCP Reload** en Cursor (Command Palette → *Reload MCP*).

## Convenciones de código

- **Backend:** `backend/src/` — config, controllers, middleware, models, routes, services, schemas, tests
- **Seguridad Sprint 0:** Zod en entradas, sanitize-html, Helmet, rate limit, `X-Powered-By` off
- **Tests:** `npm test` en `/backend` (23+ tests); no asserts triviales
- **Secretos:** solo en `.env` (nunca git ni Engram). Vars: `API_FOOTBALL_KEY`, `MONGODB_URI`
- **Arranque:** `backend`: `npm run dev` · `frontend`: `npm run dev` · sync: `npm run sync`

## Memoria Engram (sesiones futuras)

Al iniciar trabajo en este repo:

1. `mem_search` con query `predictive_modeling` o topic keys listados abajo.
2. No guardar API keys ni PII en Engram.
3. Tras decisiones relevantes: `mem_save` con `topic_key: predictive_modeling/...`.

Topic keys canónicos:

| topic_key | Contenido |
|-----------|-----------|
| `predictive_modeling/project-profile` | Identidad, stack, rutas, arranque |
| `predictive_modeling/jira-backlog` | PRODE-1..12 ↔ H1–H12 |
| `predictive_modeling/architecture` | Servicios, endpoints, flujo sync |
| `predictive_modeling/math-model` | Dixon-Coles, A/D, ρ, γ |
| `predictive_modeling/conventions` | PRODE-N, T-Shirt, MVC |
| `predictive_modeling/mcp-config` | `.cursor/mcp.json`, Engram, context7 |
| `predictive_modeling/skill-registry` | Registry `.atl/skill-registry.md` |

## Documentación referenciada

| Archivo | Propósito |
|---------|-----------|
| [docs/architecture.md](./docs/architecture.md) | Flujo API-Football → motor → dashboard |
| [docs/math_model.md](./docs/math_model.md) | Fórmulas Poisson / Dixon-Coles |
| [.agents/skills/README.md](./.agents/skills/README.md) | Instalación de agent skills |
