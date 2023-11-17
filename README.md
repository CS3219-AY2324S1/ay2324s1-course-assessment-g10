# Assignment 3 Running Instructions

## Deliverables

- Show user Authentication and user roles management

To run user service and question service, we need their dependencies:
- User Service is dependent on Postgres
- Qn Service is dependent on MongoDB

> Docker-compose project is set up for running mongodb and postgreSQL service.

## Setting up .env files
1. In the root of the repository, set up `.env` files for running the 2 database services
   ```.env
    POSTGRES_USER="user"
    POSTGRES_PASSWORD="test_pass1234"
    POSTGRES_DB="user-service"
    PG_PORT=5432
   ```

2. In `./user_service`, set up `.env` as such
    ```
    DATABASE_URL="postgresql://user:test_pass1234@localhost:5432/user-service?schema=public"
    SECRET_KEY="hello_world!"
    ```

3. In `./question_service`, set up `.env` as such

    ```
    MONGODB_URI=mongodb://localhost:27017/question_service
    SECRET_KEY="hello_world!"
    ```

4. No `.env` files needed for Frontend

## Running instructions
0. Set up .env files in 
1. Start User Service and PostgreSQL 
2. Start Question Service and MongoDB
3. Start Frontend


## Detailed Running Instructions

1. **Start MongoDB and PostgreSQL** service using docker-compose project located at root of the repository: `./docker_compose_dev.yml`

    > ```bash
    > # navigate to root of repository
    > docker compose -f ./docker_compose_dev.yml up --build
    >  ```

2. **Starting User Service**
   1. Navigate to `./user_service`
   2. Install all npm libraries
        ```bash
        npm i  #installs all relevant node modules
        npx prisma generate #initializes the prisma client
        ```

        Sample output after running `npx prisma generate`:
        ```
        Environment variables loaded from .env
        Prisma schema loaded from prisma\schema.prisma
        
        ✔ Generated Prisma Client (v5.6.0) to .\node_modules\@prisma\client in 88ms
        
        Start using Prisma Client in Node.js (See: https://pris.ly/d/client)
        ```

    3. Run User Service
        ```bash
        npm run start  #starts the server
        ```

        Sample output:
        ```
        > user_service@1.0.0 start
        > npm run migrate && ts-node src/index.ts


        > user_service@1.0.0 migrate
        > npx prisma db push

        Environment variables loaded from .env
        Prisma schema loaded from prisma\schema.prisma
        Datasource "db": PostgreSQL database "user-service", schema "public" at "localhost:5432"

        Your database is now in sync with your Prisma schema. Done in 123ms

        ✔ Generated Prisma Client (v5.6.0) to .\node_modules\@prisma\client in 117ms

        Initial Admin created!
        User service is running on http://localhost:8081
        ```

3. **Starting Question Service**
   1. Navigate to `./question_service`
   2. Install node modules: `npm i`
   3. Start question service `npm run start`
        
        Sample output:

        ```
        PS C:\Users\Chee Hong\Desktop\PeerPrep\question_service> npm run start

        > question_service@1.0.0 start
        > ts-node src/index.ts

        connecting with... mongodb://localhost:27017/question_service
        Server is running on port 8080...
        MongoDB connected: localhost
        Counter found in DB, current sequence: 20
        Question already exists, cancelling populate
        Questions population completed.
        ```

4. Start the frontend
   1. Navigate to `./frontend`
   2. Install node modules: `npm i`
   3. Start: `npm run prod`

### Debugging common problems

1.  I ran into an authentication failure like this:
    ```
    Error: P1000: Authentication failed against database server at `localhost`, the provided database credentials for `user` are not valid.
    ```

    > -  Make sure you do not have another PostgreSQL/MongoDB service running on `localhost`
    > - Make sure you set the `.env` files correctly at root and in the `user_service` folders

2. After I refresh the page, all my changes to the questions repository were not preserved!
   > Make sure you are running the frontend with `npm run prod` and not `npm run start`. The latter only makes changes to the redux state and does not call the qn service backend!
   >
   > You will know you ran `npm run start` if there are 20 questions displayed in the bank page. 
   > `npm run prod` displays 9 because there are only 9 questions populated in the DB
