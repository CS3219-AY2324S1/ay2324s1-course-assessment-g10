# Quickstart

1. Install relevant node libraries
   - Run `npm i`
2. Ensure MongoDB service is running on your localhost
3. Start the server
   - Run `npm run start`


# Running this service in isolation

1. To run this service, navigate to the root of this directory.
2. Call `docker-compose up --build`
   - This will start this backend server as a docker container
   - Since this service depends on a mongodb service, a mongo server is also started in another container

3. The server should be accessible via the endpoint localhost:8081/api/questions/

