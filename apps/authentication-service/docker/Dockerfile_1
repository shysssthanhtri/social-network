FROM node:alpine AS core
WORKDIR /app
RUN npm i -g pnpm

ARG PORT=3000
EXPOSE ${PORT}

FROM core AS installing
COPY ./package.json .
COPY ./pnpm-lock.yaml .
RUN pnpm install

FROM installing AS building
COPY ./nest-cli.json .
COPY ./tsconfig*.json .
COPY ./src ./src
RUN pnpm run build

FROM building AS developing
CMD [ "pnpm", "run", "start:dev" ]

FROM core AS production-installing
COPY ./package.json .
COPY ./pnpm-lock.yaml .
RUN pnpm install -P

FROM alpine AS production
WORKDIR /app
RUN apk add --no-cache nodejs
COPY --from=building /app/dist /app/dist
COPY --from=production-installing /app/node_modules /app/node_modules
CMD [ "node", "dist/main" ]
