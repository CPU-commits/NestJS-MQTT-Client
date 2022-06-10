import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { MqttService } from '../service/mqtt.service'

@Controller('mqtt')
export class MqttController {
    constructor(private readonly mqttService: MqttService) {}

    @MessagePattern('agent/onconnect')
    onConnection(@Payload() data: string) {
        this.mqttService.registerAgent(data)
    }
}
