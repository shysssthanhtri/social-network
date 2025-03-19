FROM node:alpine AS core
WORKDIR /app
RUN npm i -g pnpm

ARG PORT=3000
EXPOSE ${PORT}


FROM alpine AS copying-core-components
WORKDIR /app
COPY ./nx.json .
COPY ./pnpm-workspace.yaml .
COPY ./package.json .
COPY ./pnpm-lock.yaml .

# Required packages
COPY ./packages/common-nestjs-server/package.json /app/packages/common-nestjs-server/package.json
COPY ./packages/nestjs-postgresql/package.json /app/packages/nestjs-postgresql/package.json
COPY ./packages/rabbitmq-config/package.json /app/packages/rabbitmq-config/package.json

# Application
COPY ./apps/authentication-service/package.json /app/apps/authentication-service/package.json


FROM copying-core-components AS installing
RUN apk add --no-cache nodejs npm
RUN npm i -g pnpm
RUN pnpm install --ignore-scripts


FROM installing AS building
COPY ./tsconfig.base.json .
COPY ./apps/authentication-service/nest-cli.json /app/apps/authentication-service/nest-cli.json

COPY ./packages/common-nestjs-server/tsconfig.json /app/packages/common-nestjs-server/tsconfig.json
COPY ./packages/common-nestjs-server/src /app/packages/common-nestjs-server/src

COPY ./packages/nestjs-postgresql/tsconfig.json /app/packages/nestjs-postgresql/tsconfig.json
COPY ./packages/nestjs-postgresql/src /app/packages/nestjs-postgresql/src

COPY ./packages/rabbitmq-config/tsconfig.json /app/packages/rabbitmq-config/tsconfig.json
COPY ./packages/rabbitmq-config/src /app/packages/rabbitmq-config/src

COPY ./apps/authentication-service/tsconfig.json /app/apps/authentication-service/tsconfig.json
COPY ./apps/authentication-service/tsconfig.build.json /app/apps/authentication-service/tsconfig.build.json
COPY ./apps/authentication-service/src /app/apps/authentication-service/src

RUN npx nx build authentication-service


FROM building AS developing
CMD [ "npx", "nx", "start:dev", "authentication-service" ]


FROM copying-core-components AS installing-production
RUN apk add --no-cache nodejs npm
RUN npm i -g pnpm
RUN pnpm install -P --ignore-scripts


FROM copying-core-components AS production
WORKDIR /app
RUN apk add --no-cache nodejs

# Required packages
COPY --from=building /app/packages/common-nestjs-server/dist /app/packages/common-nestjs-server/dist
COPY --from=building /app/packages/nestjs-postgresql/dist /app/packages/nestjs-postgresql/dist
COPY --from=building /app/packages/rabbitmq-config/dist /app/packages/rabbitmq-config/dist

COPY --from=installing-production /app/packages/common-nestjs-server/node_modules /app/packages/common-nestjs-server/node_modules
COPY --from=installing-production /app/packages/nestjs-postgresql/node_modules /app/packages/nestjs-postgresql/node_modules

# Application
COPY --from=building /app/apps/authentication-service/dist /app/apps/authentication-service/dist
COPY --from=building /app/apps/authentication-service/node_modules /app/apps/authentication-service/node_modules

COPY --from=installing-production /app/node_modules /app/node_modules

CMD [ "node", "apps/authentication-service/dist/main" ]
