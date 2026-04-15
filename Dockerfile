# syntax=docker/dockerfile:1.6
FROM node:20-alpine

WORKDIR /app

# Installer les deps d'abord (cache docker layer)
COPY package.json package-lock.json* ./
RUN npm install --omit=dev --no-audit --no-fund

# Copier le reste du site
COPY . .

# Le dossier gallery/ du repo sert de seed pour le volume persistant.
# À l'exécution, DATA_DIR (volume monté) recevra ces fichiers s'il est vide.
RUN mv gallery gallery-seed && mkdir -p gallery

ENV NODE_ENV=production \
    PORT=3000 \
    DATA_DIR=/app/gallery

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/healthz || exit 1

CMD ["node", "server.js"]
