FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY prisma ./
COPY tsconfig.json ./
RUN npm install
# RUN npm ci --omit=dev
RUN npx prisma generate

COPY . .
EXPOSE 8081
CMD ["npm", "run", "start"]