FROM node:20

WORKDIR /app

ENV NODE_OPTIONS="--max-old-space-size=512"
ENV NEXT_TELEMETRY_DISABLED=1

COPY package*.json ./
RUN npm cache clean --force && npm install --no-audit --no-fund --legacy-peer-deps

COPY . .

CMD ["npm", "run", "dev"]
