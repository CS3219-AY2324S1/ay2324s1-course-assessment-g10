import express from 'express';
import cookieParser from 'cookie-parser';
import { setupProxies } from './proxy/proxy';
import { routes_config } from './proxy/routes_config';
import { jwtCheck, onCredentialFailure } from './middleware/token_check';
import { setupLogging } from './middleware/logging';
import { isLocal } from './proxy/service_addresses';

const app = express();
const port = process.env.PORT || 8000;

app.use(cookieParser())

setupLogging(app);
app.use(jwtCheck.unless({ path: [/\/auth\//] }));
app.use(onCredentialFailure);

setupProxies(app, routes_config);

app.listen(port, () => {
    console.log(`API Gateway running in ${isLocal ? "local" : "docker"} mode`)
    console.log(`API Gateway listening at http://localhost:${port}`);
})