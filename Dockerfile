FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package.json ./
COPY .next ./.next
COPY public ./public
COPY node_modules ./node_modules

RUN npm install -g pnpm

EXPOSE 3000

CMD ["pnpm", "start"]