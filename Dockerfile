FROM oven/bun:alpine

WORKDIR /app

COPY build/ ./

COPY package.json bun.lock ./
RUN bun add @sveltejs/kit
RUN bun install --production --frozen-lockfile


EXPOSE 3000

CMD ["bun", "index.js"]
