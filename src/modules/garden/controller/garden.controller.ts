import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { Plant } from '../models/plant.model'
import { GardenService } from '../service/garden.service'

@Controller('garden')
export class GardenController {
    constructor(private gardenService: GardenService) {}

    @MessagePattern('garden/message')
    getMessage(@Payload() data: string) {
        let splitData: any = data.split('.')
        splitData = splitData.map((text: string) => {
            return text.split(':')
        })
        this.gardenService.insertMetrics({
            agent: splitData[0][1],
            temperature: parseFloat(`${splitData[1][1]}.${splitData[2]}`),
            rain: splitData[3][1] === '1',
            rh: parseInt(splitData[4][1]),
            day: splitData[5][1] === '1',
        })
    }

    @MessagePattern('garden/plants')
    registerPlants(@Payload() plants: Array<Plant>) {
        this.gardenService.registerPlants(plants)
    }
}
