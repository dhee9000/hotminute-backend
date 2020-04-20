const mongo = require('mongoose');

const mongoURI = process.env.MONGO_URI;

mongo.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(e => {
    console.error("❌ MongoDB Connection Error:", e)
});

mongo.set('useCreateIndex', true);
mongo.connection.once('open', () => {
    console.log('💾 Connected to MongoDB database');
});