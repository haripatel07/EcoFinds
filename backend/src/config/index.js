const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const required = (name) => {
    if (!process.env[name]) {
        throw new Error(`Missing required env var ${name}`);
    }
    return process.env[name];
};

module.exports = {
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGO_URI || process.env.MONGODB_URI || required('MONGO_URI'),
    jwtSecret: process.env.JWT_SECRET || required('JWT_SECRET'),
    jwtExpire: process.env.JWT_EXPIRE || '30d',
    bcryptRounds: Number(process.env.BCRYPT_SALT_ROUNDS || 10),
    rateLimit: {
        windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000),
        max: Number(process.env.RATE_LIMIT_MAX || 100)
    },
    email: {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER || '',
        service: process.env.EMAIL_SERVICE || process.env.EMAIL_HOST || '',
        host: process.env.EMAIL_HOST || '',
        port: Number(process.env.EMAIL_PORT || 0),
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || ''
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
        apiKey: process.env.CLOUDINARY_API_KEY || '',
        apiSecret: process.env.CLOUDINARY_API_SECRET || ''
    }
};
