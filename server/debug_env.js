require('dotenv').config();
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('MONGODB_URI length:', process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0);
if (!process.env.MONGODB_URI) {
    console.error('ERROR: MONGODB_URI is undefined in process.env');
}
process.exit(0);
