import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Agent } from './entities/agents'
import { MqttController } from './controller/mqtt.controller'
import { MqttService } from './service/mqtt.service'

@Module({
    imports: [TypeOrmModule.forFeature([Agent])],
    controllers: [MqttController],
    providers: [MqttService],
})
export class MqttModule {}
