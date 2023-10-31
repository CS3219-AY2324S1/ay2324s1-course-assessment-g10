import { matchServiceHostUrl, questionServiceUrl, userServiceHostUrl } from "./service_addresses";

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
    {
        url: "/matchmake",
        proxy: {
            target: matchServiceHostUrl,
            ws: true,
            pathRewrite: { 
                '/matchmake': '/' }
        }
    }
]