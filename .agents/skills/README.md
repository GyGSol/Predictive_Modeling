# Agent Skills — Predictive Modeling

Skills instalados manualmente en `.agents/skills/` (el CLI `npx skills add` falló por paths/autenticación en algunos repos; se clonaron desde GitHub).

| Skill | Origen | Uso |
|-------|--------|-----|
| `tdd` | mattpocock/skills | Red-green-refactor con Jest |
| `improve-codebase-architecture` | mattpocock/skills | Patrones y ADRs |
| `nodejs-backend-patterns` | wshobson/agents | Estructura Express/MVC |
| `vercel-react-best-practices` | vercel-labs/agent-skills | Optimización React |

Para reinstalar vía CLI (si GitHub auth está configurado):

```bash
npx skills@latest add mattpocock/skills/tdd --yes
npx skills@latest add mattpocock/skills/improve-codebase-architecture --yes
npx skills@latest add wshobson/agents/nodejs-backend-patterns --yes
npx skills@latest add vercel-labs/agent-skills/react-best-practices --yes
```
