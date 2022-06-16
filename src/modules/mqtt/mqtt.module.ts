import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { WebModule } from '../web/web.module'
import { MqttController } from './controller/mqtt.controller'
import { Agent, SchemaAgent } from './entities/agents.entity'
import { SchemaTask, Task } from './entities/task.entity'
import { MqttService } from './service/mqtt.service'

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Agent.name,
                schema: SchemaAgent,
            },
            {
                name: Task.name,
                schema: SchemaTask,
            },
        ]),
        WebModule,
    ],
    controllers: [MqttController],
    providers: [MqttService],
    exports: [MqttService],
})
export class MqttModule {}
