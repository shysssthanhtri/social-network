# Social network microservices

![Graphql](./public/ideas.png)

## Scripts
- Start development environment: `make start-env`
- Start development environment with logs: `make start-env-debug`
- Stop development environment: `make stop-env`

- Show graph: `npx nx graph`
- Show graph affected: `npx nx graph --affected`

- Run lint for affected packages: `npx nx affected -t lint`

## Local development
- Setup env config
  - Copy `.env.sample` into `.env`
  - cd `docker`
  - run `ln -s ../.env ./.env`
- Start development environment: `make start-env`
- Stop development environment: `make stop-env`
