# Stack Detection & Analysis Checklist

Use this lookup table during Phase 2 (Analysis) to confirm your technology stack identification.
Match the files you found in Phase 1 against this table.

---

## Language & Runtime Detection

| File Found | Inferred Stack |
|---|---|
| `package.json` | Node.js (JavaScript or TypeScript) |
| `tsconfig.json` alongside `package.json` | Node.js + TypeScript |
| `requirements.txt` or `pyproject.toml` | Python |
| `Pipfile` | Python + Pipenv |
| `pom.xml` | Java + Maven |
| `build.gradle` | Java or Kotlin + Gradle |
| `Cargo.toml` | Rust |
| `go.mod` | Go |
| `*.csproj` or `*.sln` | .NET / C# |
| `Gemfile` | Ruby |
| `composer.json` | PHP |

---

## Framework Detection (Node.js)

| Dependency in `package.json` | Framework |
|---|---|
| `express` | Express.js — minimal HTTP server |
| `fastify` | Fastify — high-performance HTTP server |
| `@nestjs/core` | NestJS — opinionated, Angular-like backend |
| `next` | Next.js — React SSR/SSG framework |
| `nuxt` | Nuxt — Vue SSR/SSG framework |
| `@sveltejs/kit` | SvelteKit — Svelte full-stack framework |
| `koa` | Koa — minimalist Node.js framework |
| `hapi` | Hapi — enterprise Node.js framework |
| `react` (no server framework) | React SPA (likely Vite or CRA) |
| `vue` (no server framework) | Vue SPA |
| `svelte` (no server framework) | Svelte SPA |

---

## Framework Detection (Python)

| File / Import Found | Framework |
|---|---|
| `flask` in requirements | Flask — lightweight Python web framework |
| `fastapi` in requirements | FastAPI — modern async Python API framework |
| `django` in requirements | Django — batteries-included Python web framework |
| `manage.py` in root | Django project |

---

## Database Detection

| Dependency / File Found | Database / ORM |
|---|---|
| `pg` or `postgres` in `package.json` | PostgreSQL (raw driver) |
| `mysql2` or `mysql` in `package.json` | MySQL (raw driver) |
| `mongodb` or `mongoose` in `package.json` | MongoDB |
| `sqlite3` or `better-sqlite3` | SQLite |
| `prisma` in `package.json` / `schema.prisma` exists | Prisma ORM |
| `sequelize` in `package.json` | Sequelize ORM |
| `typeorm` in `package.json` | TypeORM |
| `knex` in `package.json` | Knex.js query builder |
| `redis` or `ioredis` in `package.json` | Redis |
| `sqlalchemy` in requirements | Python SQLAlchemy ORM |

---

## Architecture Pattern Detection

| Signal | Pattern |
|---|---|
| `routes/`, `controllers/`, `models/` folders | MVC (Model-View-Controller) |
| `handlers/` or `resolvers/` with `schema.graphql` | GraphQL API |
| Multiple `services/` with separate `package.json` files | Microservices |
| Single `src/` with layered folders | Layered / N-Tier architecture |
| `domain/`, `application/`, `infrastructure/` folders | Hexagonal / Clean Architecture |
| `pages/` or `app/` with file-based routing | Next.js / Nuxt file-based routing |
| `@Module()` decorators (NestJS) | Modular dependency-injection architecture |

---

## Build & Test Tool Detection

| File Found | Tool |
|---|---|
| `vite.config.*` | Vite build tool |
| `webpack.config.*` | Webpack bundler |
| `jest.config.*` or `"jest"` in package.json | Jest test runner |
| `vitest.config.*` | Vitest test runner |
| `playwright.config.*` | Playwright E2E tests |
| `cypress.config.*` | Cypress E2E tests |
| `.eslintrc.*` or `eslint.config.*` | ESLint linter |
| `.prettierrc*` | Prettier formatter |
| `Dockerfile` | Docker containerisation |
| `docker-compose.yml` | Docker Compose multi-service setup |

---

## CI/CD Detection

| File Found | CI Platform |
|---|---|
| `.github/workflows/*.yml` | GitHub Actions |
| `.gitlab-ci.yml` | GitLab CI |
| `Jenkinsfile` | Jenkins |
| `.circleci/config.yml` | CircleCI |
| `azure-pipelines.yml` | Azure DevOps |
| `.travis.yml` | Travis CI |

---

## Environment Variable Patterns

When reading `.env.example` or `.env.sample`, categorize each variable:

| Pattern | Category |
|---|---|
| `PORT`, `HOST` | Server configuration |
| `DATABASE_URL`, `DB_HOST`, `DB_PORT`, `DB_NAME` | Database connection |
| `JWT_SECRET`, `SECRET_KEY`, `API_SECRET` | Security / secrets |
| `REDIS_URL`, `CACHE_URL` | Cache configuration |
| `SMTP_*`, `MAIL_*`, `SENDGRID_*` | Email configuration |
| `AWS_*`, `S3_*` | AWS / cloud storage |
| `STRIPE_*`, `PAYMENT_*` | Payment processing |
| `LOG_LEVEL`, `NODE_ENV` | Application behaviour |
| `CORS_ORIGIN`, `ALLOWED_ORIGINS` | CORS / security |
