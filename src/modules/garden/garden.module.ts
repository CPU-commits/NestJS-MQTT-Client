import { Module } from '@nestjs/common'
import { GardenController } from './controller/garden.controller'
import { GardenService } from './service/garden.service'

@Module({
    controllers: [GardenController],
    providers: [GardenService],
})
export class GardenModule {}
