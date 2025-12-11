FROM node:22-alpine AS base

RUN corepack enable

FROM base AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.yml* ./

#install dependencies
RUN pnpm install --frozen-lockfile

# Copy all code
COPY . .

# Build Next.js
RUN pnpm run build

# Runner 
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy compiled project from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD [ "pnpm" , "start" ]