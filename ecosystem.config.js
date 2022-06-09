module.exports = {
    apps: [{
        name: 'nami-exchange-web-v2',
        script: 'yarn',
        args: 'start',
        interpreter: '/bin/bash',
        instances: 'max',
        exec_mode: 'cluster',
        autorestart: false,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'development',
        },
        env_production: {
            NODE_ENV: 'production',
        },
        time: true,
    }],
};
