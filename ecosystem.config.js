module.exports = {
    apps: [
        {
            name: 'nami-exchange-web-v2',
            script: 'npm run start',
            max_memory_restart: '2G',
            env: {
                NODE_ENV: 'development',
            },
            env_production: {
                NODE_ENV: 'production',
            },
        },
    ],
    deploy: {
        production: {
            'post-deploy': 'sh nextjs-pm2-deploy.sh',
        },
    },
};
