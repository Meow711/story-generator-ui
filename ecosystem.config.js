module.exports = {
    apps: [
        {
            name: "nextjs-app",
            script: ".next/standalone/server.js",
            env: {
                PORT: 6006,
                NODE_ENV: "production"
            }
        }
    ]
};
