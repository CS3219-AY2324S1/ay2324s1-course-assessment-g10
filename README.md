# Assignment 1 Running Instructions

## Deliverables

- Frontend Question Repository with CRUD functionality
- Persistence when creating/updating/deleting the question repository

## Setting up .env files

1. In `./question_service`, set up `.env` as such

    ```
    MONGODB_URI=mongodb://localhost:27017/question_service
    ```

2. No `.env` files needed for Frontend

## Running instructions
0. Set up .env files in `./question_service`
1. Start Question Service and MongoDB
2. Start Frontend


## Detailed Running Instructions

1. **Start MongoDB** service using docker-compose project located at root of the repository: `./docker_compose_dev.yml`


    > ```bash
    > # navigate to root of repository
    > docker compose -f ./docker_compose_dev.yml up --build
    >  ```

1. **Starting Question Service**
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

2. Start the frontend
   1. Navigate to `./frontend`
   2. Install node modules: `npm i`
   3. Start: `npm run prod`

### Debugging common problems

1.  I ran into an authentication failure like this:
    ```
    Error: P1000: Authentication failed against database server at `localhost`, the provided database credentials for `user` are not valid.
    ```

    > - Make sure you do not have another PostgreSQL/MongoDB service running on `localhost`
    > - Make sure you set the `.env` files correctly at root and in the `question_service` folders

2. After I refresh the page, all my changes to the questions repository were not preserved!
   > Make sure you are running the frontend with `npm run prod` and not `npm run start`. The latter only makes changes to the redux state and does not call the qn service backend!
   >
   > You will know you ran `npm run start` if there are 20 questions displayed in the bank page. 
   > `npm run prod` displays 9 because there are only 9 questions populated in the DB


3. I am getting network error when deleting questions!
   
   > - Make sure you run `npm run prod` instead of `npm run start` for the frontend
   > - Make sure question service is up and running on `localhost:8080`

4. The question service crashed with the following message:

    ```
    MongooseServerSelectionError: connect ECONNREFUSED ::1:27017
        at _handleConnectionErrors 
        ...
        at processTimers (node:internal/timers:512:7) {
    reason: TopologyDescription {
        type: 'Unknown',
        servers: Map(1) { 'localhost:27017' => [ServerDescription] },
        stale: false,
        compatible: true,
        heartbeatFrequencyMS: 10000,
        localThresholdMS: 15,
        setName: null,
        maxElectionId: null,
        maxSetVersion: null,
        commonWireVersion: 0,
        logicalSessionTimeoutMinutes: null
    },
    code: undefined
    }
    Unable to establish connection with MongoDB service... Please check if the service is running
    ```
    > - Make sure your MongoDB is running at `localhost:27017`. Easiest way to do this is to run the service as a docker container. We have provided a `./docker_compose_dev.yml` at the root of the repository to help with running the MongoDB service