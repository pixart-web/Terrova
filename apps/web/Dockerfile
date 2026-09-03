FROM node:24-alpine AS build
WORKDIR /app
RUN corepack enable
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @terrova/web build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable && addgroup -S terrova && adduser -S terrova -G terrova
COPY --from=build --chown=terrova:terrova /app /app
USER terrova
EXPOSE 3000
CMD ["pnpm", "--filter", "@terrova/web", "start"]
