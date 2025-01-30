# Global arguments
ARG BASE_IMAGE=node:lts-alpine
ARG APP_DIR=/usr/src/app
ARG UID=1000
ARG GID=1000
ARG PORT=3000

# Base stage
FROM ${BASE_IMAGE} AS base
ARG APP_DIR
ARG UID
ARG GID
ARG PORT

RUN mkdir -p ${APP_DIR} && \
    chown -R ${UID}:${GID} ${APP_DIR}

USER ${UID}:${GID}

WORKDIR ${APP_DIR}

ENV PORT=${PORT}
EXPOSE ${PORT}

COPY --chown=${UID}:${GID} package.json .

# Dependencies stage
FROM base AS dependencies
ARG APP_DIR

RUN npm install && \
    npm cache clean --force && \
    touch ${APP_DIR}/production.env && \
    touch ${APP_DIR}/development.env

ENV PATH=${APP_DIR}/node_modules/.bin:$PATH

# Development stage
FROM dependencies AS development
ARG UID
ARG GID

ENV NODE_ENV=development

COPY --chown=${UID}:${GID} . .

CMD ["npm", "run", "dev"]

# Build stage
FROM dependencies AS build
ARG UID
ARG GID

COPY --chown=${UID}:${GID} . .

RUN npm run build

# Production stage
FROM dependencies AS production
ARG UID
ARG GID
ARG APP_DIR

ENV NODE_ENV=production

COPY --chown=${UID}:${GID} ./public ./public
COPY --chown=${UID}:${GID} ./views ./views
COPY --chown=${UID}:${GID} --from=build ${APP_DIR}/dist ./dist

CMD ["node", "./dist", "--env=production"]
