module.exports = {
    apps: [{
        name: 'attlas-exchange-web',
        script: 'yarn',
        args: 'start',
        interpreter: '/bin/bash',
        instances: 'max',
        exec_mode: 'cluster',
        autorestart: true,
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
