FROM node:alpine AS core
WORKDIR /app
RUN npm i -g pnpm

ARG PORT=3000
EXPOSE ${PORT}


FROM core AS installing
COPY ./package.json .
COPY ./pnpm-workspace.yaml .
COPY ./nx.json .

COPY ./packages/common-nestjs-server/package.json /app/packages/common-nestjs-server/package.json
COPY ./packages/nestjs-postgresql/package.json /app/packages/nestjs-postgresql/package.json
COPY ./packages/rabbitmq-config/package.json /app/packages/rabbitmq-config/package.json

COPY ./apps/authentication-service/package.json /app/apps/authentication-service/package.json

COPY ./pnpm-lock.yaml .

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

# COPY ./tsconfig.base.json .
# COPY ./package.json .
# COPY ./pnpm-*.yaml .
# COPY ./nx.json .
# COPY ./packages ./packages
# COPY ./apps/authentication-service ./apps/authentication-service
# RUN pnpm install
# RUN npx nx build authentication-service
