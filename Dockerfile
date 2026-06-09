FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

COPY index.html local-proxy.js server.js README.md ./
COPY assets ./assets

EXPOSE 8080
CMD ["node", "server.js"]
