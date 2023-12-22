# Builder image
FROM --platform=linux/amd64 node:18-alpine AS build

RUN apk add --update --no-cache curl bash git python3 make g++

ARG PROJECT_NAME

WORKDIR /app

# Set up pnpm
# RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm && \
#     pnpm config set store-dir .pnpm-store

RUN corepack enable && corepack prepare pnpm@latest --activate

# Enable `pnpm add --global` on Alpine Linux by setting
# home location environment variable to a location already in $PATH
# https://github.com/pnpm/pnpm/issues/784#issuecomment-1518582235
ENV PNPM_HOME=/usr/local/bin
ENV NEXT_TELEMETRY_DISABLED 1

COPY pnpm-lock.yaml .npmrc* ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm fetch

# Build
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --offline --workspace-root --filter ${PROJECT_NAME}
# RUN pnpm run build --filter=${PROJECT_NAME}...
RUN pnpm --filter ${PROJECT_NAME} postinstall
RUN pnpm --filter ${PROJECT_NAME} cibuild

# # WORKAROUND FOR: https://github.com/vercel/next.js/discussions/39432
# RUN pnpm install --prod --frozen-lockfile --offline --shamefully-hoist --ignore-scripts --workspace-root --filter ${PROJECT_NAME} && \
#     cp -Lr ./node_modules ./node_modules_temp && \
#     rm -rf ./node_modules_temp/.cache && \
#     rm -rf ./node_modules_temp/.pnpm
# # END WORKAROUND

# Runtime image
FROM node:18-alpine AS release

ARG PROJECT_NAME

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs


COPY --from=build --chown=nextjs:nodejs /app/apps/${PROJECT_NAME}/.next/standalone/ ./
COPY --from=build --chown=nextjs:nodejs /app/apps/${PROJECT_NAME}/next.config.mjs ./apps/${PROJECT_NAME}/
COPY --from=build --chown=nextjs:nodejs /app/apps/${PROJECT_NAME}/package.json ./apps/${PROJECT_NAME}/
COPY --from=build --chown=nextjs:nodejs /app/apps/${PROJECT_NAME}/public* ./apps/${PROJECT_NAME}/public
COPY --from=build --chown=nextjs:nodejs /app/apps/${PROJECT_NAME}/.next/static* ./apps/${PROJECT_NAME}/.next/static
COPY --chown=nextjs:nodejs ./docker/entrypoint.sh /app/entrypoint.sh

RUN chmod +x /app/entrypoint.sh

USER root

RUN ln -s /app/apps/${PROJECT_NAME}/server.js /app/server.js && ln -s /app/apps/${PROJECT_NAME}/.env /app/.env

# WORKAROUND FOR: https://github.com/vercel/next.js/discussions/39432
# RUN rm -rf ./node_modules
# COPY --from=build /app/node_modules_temp ./node_modules
# END WORKAROUND

USER nextjs

EXPOSE 80

ENV PORT 80
ENV HOSTNAME localhost
ENV NEXT_TELEMETRY_DISABLED 1

HEALTHCHECK --interval=5s --timeout=3s \
    CMD wget -qO- http://localhost:80/ || exit 1

# CMD ["node", "/app/apps/factory/server.js"]
ENTRYPOINT [ "/app/entrypoint.sh" ]
CMD ["node", "/app/server.js"]