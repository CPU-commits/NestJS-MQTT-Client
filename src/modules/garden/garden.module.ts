import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MqttModule } from '../mqtt/mqtt.module'
import { GardenController } from './controller/garden.controller'
import { Garden, SchemaGarden } from './entities/garden.entity'
import { GardenService } from './service/garden.service'

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Garden.name,
                schema: SchemaGarden,
            },
        ]),
        MqttModule,
    ],
    controllers: [GardenController],
    providers: [GardenService],
})
export class GardenModule {}
