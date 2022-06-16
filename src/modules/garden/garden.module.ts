import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MqttModule } from '../mqtt/mqtt.module'
import { WebModule } from '../web/web.module'
import { GardenController } from './controller/garden.controller'
import { Garden, SchemaGarden } from './entities/garden.entity'
import { Plant, SchemaPlant } from './entities/plant.entity'
import { GardenService } from './service/garden.service'

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Garden.name,
                schema: SchemaGarden,
            },
            {
                name: Plant.name,
                schema: SchemaPlant,
            },
        ]),
        MqttModule,
        WebModule,
    ],
    controllers: [GardenController],
    providers: [GardenService],
    exports: [GardenService],
})
export class GardenModule {}
