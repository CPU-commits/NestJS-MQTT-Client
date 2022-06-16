import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { AppModule } from './app.module'
import config from './config'

async function bootstrap() {
    // Config
    const configService = config()
    const app = await NestFactory.create(AppModule)
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.MQTT,
        options: {
            url: `mqtt://${configService.mqtt.hostname}:1883`,
            username: configService.mqtt.username,
            password: configService.mqtt.password,
        },
    })
    // CORS
    app.enableCors({
        origin: '*',
    })
    await app.startAllMicroservices()
    await app.listen(3000)
}
bootstrap()
