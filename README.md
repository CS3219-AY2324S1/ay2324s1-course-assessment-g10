# Assignment 4 Running Instructions

## Deliverables

- Demonstrate containerization of User and Question Service
- Frontend not dockerized because we wanted to hot-reload the frontend, which is not possible running from a VM.
  - Frontend will be dockerized in final production build, which is tagged as the `Project Submission`

## Setting up .env files
1. In the root of the repository, set up `.env` files for running the 2 services
   ```.env
    DATABASE_URL="postgresql://user:test_pass1234@postgres:5432/user-service?schema=public"
    POSTGRES_USER="user"
    POSTGRES_PASSWORD="test_pass1234"
    POSTGRES_DB="user-service"
    PG_PORT=5432
    SECRET_KEY="hello_world!"
   ```

2. No `.env` files needed for Frontend

## Running instructions
0. Set up .env files as mentioned above
1. Run `docker-compose -f ./docker_compose_dev.yml up --build`
2. Start Frontend

## Detailed Running Instructions
0. Set up .env files as mentioned above
1. From the root of the repository, start the backend with `docker-compose -f ./docker_compose_dev.yml up --build`
2. Start the frontend
   1. Navigate to `./frontend`
   2. Install node modules: `npm i`
   3. Start: `npm run prod`

### Debugging common problems

1. After I refresh the page, all my changes to the questions repository were not preserved!
   > Make sure you are running the frontend with `npm run prod` and not `npm run start`. The latter only makes changes to the redux state and does not call the qn service backend!
   >
   > You will know you ran `npm run start` if there are 20 questions displayed in the bank page. 
   > `npm run prod` displays 9 because there are only 9 questions populated in the DB



