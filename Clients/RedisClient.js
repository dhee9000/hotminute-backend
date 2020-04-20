const redis = require("redis");
const redisOptions = { host: process.env.REDIS_HOST, password: process.env.REDIS_PASSWORD };

if (!process.env.REDIS_PASSWORD) delete redisOptions.password;
const client = redis.createClient(redisOptions);

client.on('connect', () => {
    console.log('💿 Connected to Redis application store');
})
client.on('error', (e) => {
    console.error("❌ Redis Connection Error:", e);
});

module.exports = client;