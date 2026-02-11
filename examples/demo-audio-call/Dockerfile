FROM node:22.12.0-alpine3.21 AS builder

COPY . /build
WORKDIR /build

RUN yarn install && \
    yarn build

FROM nginxinc/nginx-unprivileged:stable-alpine-slim

WORKDIR /app
COPY --from=builder /build/dist /app

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
