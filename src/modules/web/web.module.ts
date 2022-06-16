import { forwardRef, Module } from '@nestjs/common'
import { GardenModule } from '../garden/garden.module'
import { MqttModule } from '../mqtt/mqtt.module'
import { WebController } from './controller/web.controller'
import { WebService } from './service/web.service'
import { MetricsGateway } from './websockets/metrics.gateway'

@Module({
    imports: [forwardRef(() => MqttModule), forwardRef(() => GardenModule)],
    controllers: [WebController],
    providers: [WebService, MetricsGateway],
    exports: [MetricsGateway],
})
export class WebModule {}
