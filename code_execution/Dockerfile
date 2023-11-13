FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
# RUN npm ci --omit=dev
COPY . .
EXPOSE 8090
CMD ["npm", "run", "start"]
