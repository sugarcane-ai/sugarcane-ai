# Builder image
FROM --platform=linux/amd64 node:18-alpine AS build

RUN apk add --update --no-cache curl bash git python3

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
RUN pnpm fetch

# Build
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --offline --ignore-scripts --workspace-root --filter ${PROJECT_NAME}
# RUN pnpm run build --filter=${PROJECT_NAME}...
RUN pnpm --filter ${PROJECT_NAME} postinstall
RUN pnpm --filter ${PROJECT_NAME} build

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

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=build --chown=nextjs:nodejs /app/apps/${PROJECT_NAME}/next.config.mjs ./
COPY --from=build --chown=nextjs:nodejs /app/apps/${PROJECT_NAME}/public* ./public
COPY --from=build --chown=nextjs:nodejs /app/apps/${PROJECT_NAME}/package.json ./package.json

# COPY --from=builder --chown=nextjs:nodejs /app/apps/${PROJECT_NAME}/node_modules ./node_modules
COPY --from=build --chown=nextjs:nodejs /app/apps/${PROJECT_NAME}/.next/standalone/ ./
COPY --from=build --chown=nextjs:nodejs /app/apps/${PROJECT_NAME}/.next/static* ./.next/static



# WORKAROUND FOR: https://github.com/vercel/next.js/discussions/39432
# RUN rm -rf ./node_modules
# COPY --from=build /app/node_modules_temp ./node_modules
# END WORKAROUND

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME localhost
ENV NEXT_TELEMETRY_DISABLED 1

ENTRYPOINT ["node", "/app/apps/factory/server.js"]
CMD ["node", "/app/apps/factory/server.js"]