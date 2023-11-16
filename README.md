# Running this project

Simply run `docker-compose -f ./docker_compose_dev.yml up --build` or `docker-compose -f ./docker_compose_dev.yml up --build` from the root of this repo with the correct `.env` file.

Please see `.env.example` for an idea of what variables the env file should have.

The website should be hosted manually with at http://localhost:3000 by doing the following command at root.
Ensure that node version is at v18.18.x

1. `cd frontend`
2. run `npm install`
3. run `npm run prod`
4. After installing correctly
5. Webpage should be accessible at http://localhost:3000





