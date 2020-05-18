const redisConnection = require("redis-connection");
const client = redisConnection();

client.on('connect', () => {
    console.log('💿 Connected to Redis application store');
})
client.on('error', (e) => {
    console.error("❌ Redis Error:", e);
});

module.exports = client;