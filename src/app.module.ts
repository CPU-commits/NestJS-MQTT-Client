// Imports
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GardenModule } from './modules/garden/garden.module'
import { DatabaseModule } from './database/database.module'
import { MqttModule } from './modules/mqtt/mqtt.module';
import * as Joi from 'joi'
// Config
import config from './config'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            load: [config],
            isGlobal: true,
            validationSchema: Joi.object({
                PORT: Joi.number().required(),
                NODE_ENV: Joi.string().required(),
                MQTT_HOST: Joi.string().required(),
                MQTT_USERNAME: Joi.string().required(),
                MQTT_PASSWORD: Joi.string().required(),
                PG_USER: Joi.string().required(),
                PG_PASSWORD: Joi.string().required(),
                PG_HOST: Joi.string().required(),
                PG_PORT: Joi.number().required(),
                PG_DB: Joi.string().required(),
            }),
        }),
        GardenModule,
        DatabaseModule,
        MqttModule,
    ],
})
export class AppModule {}
