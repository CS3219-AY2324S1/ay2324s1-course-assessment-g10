FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
# RUN npm ci --omit=dev
COPY . .
EXPOSE 8082

CMD ["npm", "run", "start"]
