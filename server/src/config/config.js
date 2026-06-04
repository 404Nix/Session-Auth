// always required
const requiredKeys = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGODB_URI,
    NODE_ENV: process.env.NODE_ENV,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
}

for (const i in requiredKeys) {
    if (!requiredKeys[i]) {
        throw new Error(`Missing environment variable: ${i}`)
    }
}

// conditionally required
if (process.env.NODE_ENV === 'production' && !process.env.CLIENT_URL) {
    throw new Error('Missing environment variable: CLIENT_URL')
}

if (process.env.NODE_ENV === 'development' && !process.env.DEV_CLIENT_URL) {
    throw new Error('Missing environment variable: DEV_CLIENT_URL')
}

const conf = {
    PORT: Number(requiredKeys.PORT),
    MONGO_URI: requiredKeys.MONGO_URI,
    NODE_ENV: requiredKeys.NODE_ENV,
    CLIENT_URL: process.env.CLIENT_URL,
    DEV_CLIENT_URL: process.env.DEV_CLIENT_URL,
    ACCESS_TOKEN_SECRET: requiredKeys.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: requiredKeys.REFRESH_TOKEN_SECRET,
}

export default conf;