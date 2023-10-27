FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
# RUN npm ci --omit=dev
COPY . .

# RUN npm run build
# RUN node ./dist/index.js diff1
# RUN node ./dist/index.js diff2
# RUN node ./dist/index.js diff3
# RUN node ./dist/index.js diff4