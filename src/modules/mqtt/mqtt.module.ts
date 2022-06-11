import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MqttController } from './controller/mqtt.controller'
import { Agent, SchemaAgent } from './entities/agents.entity'
import { MqttService } from './service/mqtt.service'

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Agent.name,
                schema: SchemaAgent,
            },
        ]),
    ],
    controllers: [MqttController],
    providers: [MqttService],
    exports: [MqttService],
})
export class MqttModule {}
