# Modelo matemático — Dixon-Coles (Poisson)

## Objetivo

Estimar la distribución de goles en un partido de fútbol y derivar probabilidades de resultado (local / empate / visitante) para análisis de apuestas.

## Variables

| Símbolo | Descripción |
|---------|-------------|
| A_i | Fuerza ofensiva del equipo i |
| D_i | Fuerza defensiva del equipo i |
| γ | Ventaja de jugar en casa (default: 1.15) |
| λ_home | Goles esperados del local |
| λ_away | Goles esperados del visitante |
| ρ | Parámetro de dependencia Dixon-Coles (default: -0.13) |

## Goles esperados

Para un partido local **H** vs visitante **A**:

```
λ_home = A_H × D_A × γ
λ_away = A_A × D_H
```

Las fuerzas se estiman a partir del historial de la liga (promedio de goles a favor/en contra normalizado respecto a la media de la competición). En el MVP se almacenan en MongoDB (`Team.attackStrength`, `Team.defenseStrength`) y se refinan con cada jornada.

## Distribución Poisson base

La probabilidad de que un equipo marque exactamente `k` goles:

```
P(K = k) = (e^(-λ) × λ^k) / k!
```

Asumiendo independencia inicial:

```
P(H=h, A=a) = P(H=h) × P(A=a)
```

## Corrección Dixon-Coles

Los marcadores bajos están subestimados por Poisson independiente. Se aplica un factor τ(h, a):

| h | a | τ(h, a) |
|---|---|---------|
| 0 | 0 | 1 − λ_home × λ_away × ρ |
| 0 | 1 | 1 + λ_home × ρ |
| 1 | 0 | 1 + λ_away × ρ |
| 1 | 1 | 1 − ρ |
| otro | otro | 1 |

Probabilidad ajustada:

```
P*(h, a) = P(H=h) × P(A=a) × τ(h, a)
```

## Probabilidades 1X2

```
P(Local) = Σ_{h>a} P*(h, a)
P(Empate) = Σ_{h=a} P*(h, a)
P(Visitante) = Σ_{h<a} P*(h, a)
```

Se normalizan para que sumen 1.

## Implementación

Archivo: `backend/src/services/predictionEngine.service.js`

Funciones exportadas:

- `expectedGoals()` — calcula λ_home y λ_away
- `poissonProbability()` — PMF de Poisson
- `dixonColesAdjustment()` — factor τ
- `scoreMatrix()` — matriz hasta 10 goles + probabilidades 1X2
- `predictMatch()` — pipeline completo para un fixture

## Ejemplo numérico

Equipo local: A=1.30, D=0.95  
Equipo visitante: A=1.10, D=1.05  
γ = 1.15, ρ = -0.13

```
λ_home = 1.30 × 1.05 × 1.15 ≈ 1.57
λ_away = 1.10 × 0.95 ≈ 1.05
```

El motor devuelve goles esperados y probabilidades normalizadas de victoria local, empate y victoria visitante.

## Referencias

- Dixon, M.J. & Coles, S.G. (1997). *Modelling Association Football Scores and Inefficiencies in the Football Betting Market.*
- API-Football v3: https://www.api-football.com/documentation-v3
