FROM node:current-alpine

WORKDIR /app

COPY .env server.js ./
COPY build/ ./build/

RUN npm i dotenv express pg
RUN npm pkg set type=module

EXPOSE 80 443

CMD ["node", "server.js"]
