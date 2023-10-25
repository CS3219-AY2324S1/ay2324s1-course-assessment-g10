import { questionServiceUrl, userServiceHostUrl } from "./service_addresses";

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
    }
]