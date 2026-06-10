# Predictive Modeling

Dashboard de estadísticas de la Liga Argentina con predicciones basadas en el modelo Dixon-Coles (Poisson) para análisis de apuestas.

## Stack

- **Backend:** Node.js, Express, MongoDB (Mongoose), Zod, Helmet
- **Frontend:** React + Vite
- **Jira:** [PRODE — Predictive Modeling](https://feelibizaproperties.atlassian.net/jira/software/projects/PRODE)

## Inicio rápido

```bash
# Backend
cd backend && npm install && cp .env.example .env && npm run dev

# Frontend (otra terminal)
cd frontend && npm install && npm run dev
```

## Documentación

- [AGENTS.md](./AGENTS.md) — reglas Gentleman individual para agentes + Engram
- [Arquitectura](./docs/architecture.md)
- [Modelo matemático](./docs/math_model.md)

## Agent Skills

Skills instalados en `.agents/skills/`:

- `tdd` — desarrollo guiado por pruebas (Jest)
- `improve-codebase-architecture` — patrones de arquitectura
- `nodejs-backend-patterns` — estructura del API
- `vercel-react-best-practices` — optimización del frontend React

Memoria persistente: Engram (`predictive_modeling`) vía [`.cursor/mcp.json`](./.cursor/mcp.json). Tras cambios en MCP: reload en Cursor.
