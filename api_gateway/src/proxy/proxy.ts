import { Express } from 'express-serve-static-core';
import { createProxyMiddleware } from 'http-proxy-middleware'

export const setupProxies = (app: Express, routes: any[]) => {
    routes.forEach(route => {
        app.use(route.url, createProxyMiddleware(route.proxy));
    })
}