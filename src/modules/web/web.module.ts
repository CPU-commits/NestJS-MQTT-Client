import { Module } from '@nestjs/common'
import { WebController } from './controller/web.controller'
import { WebService } from './service/web.service'
import { MetricsGateway } from './websockets/metrics.gateway'

@Module({
    controllers: [WebController],
    providers: [WebService, MetricsGateway],
})
export class WebModule {}
