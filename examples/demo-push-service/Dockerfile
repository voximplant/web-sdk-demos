FROM node:22.12.0-alpine3.21 AS builder

ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_FIREBASE_MEASUREMENT_ID
ARG VITE_VOXIMPLANT_BUNDLE_ID

COPY . /build
WORKDIR /build

# In CI the .env file is absent and the config is passed as build args instead.
# Write those args into .env so both the service worker patch below and Vite's
# build pick them up. Local builds that copy an .env keep using it.
RUN if [ -n "$VITE_FIREBASE_API_KEY" ]; then \
      { \
        echo "VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY"; \
        echo "VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN"; \
        echo "VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID"; \
        echo "VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET"; \
        echo "VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID"; \
        echo "VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID"; \
        echo "VITE_FIREBASE_MEASUREMENT_ID=$VITE_FIREBASE_MEASUREMENT_ID"; \
        echo "VITE_VOXIMPLANT_BUNDLE_ID=$VITE_VOXIMPLANT_BUNDLE_ID"; \
      } > .env; \
    fi

# Files in public/ are copied verbatim and are not processed by Vite's
# import.meta.env substitution, so inject the Firebase config from .env into
# the service worker before building.
RUN set -a; [ -f .env ] && . ./.env; set +a; \
    sed -i \
      -e "s|apiKey: '[^']*'|apiKey: '${VITE_FIREBASE_API_KEY}'|" \
      -e "s|authDomain: '[^']*'|authDomain: '${VITE_FIREBASE_AUTH_DOMAIN}'|" \
      -e "s|projectId: '[^']*'|projectId: '${VITE_FIREBASE_PROJECT_ID}'|" \
      -e "s|storageBucket: '[^']*'|storageBucket: '${VITE_FIREBASE_STORAGE_BUCKET}'|" \
      -e "s|messagingSenderId: '[^']*'|messagingSenderId: '${VITE_FIREBASE_MESSAGING_SENDER_ID}'|" \
      -e "s|appId: '[^']*'|appId: '${VITE_FIREBASE_APP_ID}'|" \
      -e "s|measurementId: '[^']*'|measurementId: '${VITE_FIREBASE_MEASUREMENT_ID}'|" \
      public/firebase-messaging-sw.js

RUN YARN_CHECKSUM_BEHAVIOR=update yarn install && \
    yarn build

FROM nginxinc/nginx-unprivileged:stable-alpine-slim

WORKDIR /app
COPY --from=builder /build/dist /app

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
