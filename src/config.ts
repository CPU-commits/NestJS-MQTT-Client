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
        postgres: {
            user: process.env.PG_USER,
            host: process.env.PG_HOST,
            dbName: process.env.PG_DB,
            password: process.env.PG_PASSWORD,
            port: parseInt(process.env.PG_PORT),
        },
    }
})
