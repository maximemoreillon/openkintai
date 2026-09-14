# Build Stage 1

FROM node:22-alpine AS build
WORKDIR /app

# RUN corepack enable

# Copy package.json and lockfile
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the entire project
COPY . ./

# Build the project. DATABASE_URL is intentionally not available here — see
# nuxt.config.ts's `hub.db.driver` comment. It's supplied at container
# runtime instead (docker run / pod env), never at build time.
RUN npm run build

# Build Stage 2

FROM node:22-alpine
WORKDIR /app

# Only `.output` folder is needed from the build stage
COPY --from=build --chown=node:node /app/.output/ ./

# Change the port and host
ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

# Run as the non-root user built into the base image instead of root
USER node

CMD ["node", "/app/server/index.mjs"]