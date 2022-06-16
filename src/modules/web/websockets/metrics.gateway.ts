import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
import { GardenMetric } from 'src/modules/garden/models/metric.model'

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class MetricsGateway {
    @WebSocketServer()
    private server: Server

    sendGardenMetrics(metrics: GardenMetric) {
        this.server.emit('garden/metrics', metrics)
    }

    sendAgentStatus(agent: string, status: boolean, date?: Date) {
        this.server.emit('agents/status', {
            agent,
            status,
            date,
        })
    }
}
