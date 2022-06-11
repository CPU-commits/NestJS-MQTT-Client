import { registerAs } from '@nestjs/config'

export default registerAs('config', () => {
    return {
        port: parseInt(process.env.PORT),
        node_env: process.env.NODE_ENV,
        mqtt: {
            hostname: process.env.MQTT_HOST,
            username: process.env.MQTT_USERNAME,
            password: process.env.MQTT_PASSWORD,
        },
        mongo: {
            user: process.env.MONGO_USER,
            host: process.env.MONGO_HOST,
            dbName: process.env.MONGO_DB,
            password: process.env.MONGO_PASSWORD,
            connection: process.env.MONGO_CONNECTION,
            port: parseInt(process.env.MONGO_PORT),
        },
    }
})
