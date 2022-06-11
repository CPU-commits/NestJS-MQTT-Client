import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
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
            temperature: parseInt(splitData[1][1]),
            rain: splitData[2][1] === '1',
            rh: parseInt(splitData[3][1]),
            day: splitData[4][1] === '1',
        })
    }
}
