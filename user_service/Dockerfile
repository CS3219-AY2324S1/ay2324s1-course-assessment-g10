FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
# RUN npm ci --omit=dev
RUN npx prisma generate

COPY . .
EXPOSE 8081
CMD ["npm", "run", "start"]