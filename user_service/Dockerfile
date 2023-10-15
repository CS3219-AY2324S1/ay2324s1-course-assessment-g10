FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
COPY prisma ./
COPY tsconfig.json ./
COPY .env ./
RUN npm install
# RUN npm ci --omit=dev
RUN npx prisma generate

COPY . .
EXPOSE 8081
CMD ["npm", "run", "start"]