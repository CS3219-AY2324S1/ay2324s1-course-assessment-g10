FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
# RUN npm ci --omit=dev

COPY . .
EXPOSE 7998-8000
CMD ["npm", "run", "start"]