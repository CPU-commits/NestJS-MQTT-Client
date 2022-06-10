import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'

@Controller('garden')
export class GardenController {
    @MessagePattern('garden/message')
    getMessage(@Payload() data: string) {
        let splitData: any = data.split('.')
        splitData = splitData.map((text: string) => {
            return text.split(':')
        })
        console.log(splitData)
    }
}
