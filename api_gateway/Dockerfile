FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
# RUN npm ci --omit=dev

COPY . .
EXPOSE 8000
CMD ["npm", "run", "start"]