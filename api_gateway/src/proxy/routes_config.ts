import { collabServiceHostUrl, matchServiceHostUrl, questionServiceUrl, userServiceHostUrl } from "./service_addresses";

export const routes_config = [
    {
        url: "/api/questions",
        proxy: {
            target: questionServiceUrl,
            changeOrigin: true
        }
    },
    {
        url: "/api/users",
        proxy: {
            target: userServiceHostUrl,
            changeOrigin: true
        }
    },
    {
        url: "/auth",
        proxy: {
            target: userServiceHostUrl,
            changeOrigin: true,
            pathRewrite: { 
                '/auth': '/' }
        }
    },
]

export const ws_match_proxy_config = [
    {
        url: "/",
        proxy: {
            target: matchServiceHostUrl,
            ws: true,
            changeOrigin: true,
        }
    }
]

export const ws_collab_proxy_config = [
    {
        url: "/",
        proxy: {
            target: collabServiceHostUrl,
            ws: true,
            changeOrigin: true,
        }
    }
]