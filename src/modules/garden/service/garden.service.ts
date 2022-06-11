import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Agent } from 'src/modules/mqtt/models/agent.model'
import { MqttService } from 'src/modules/mqtt/service/mqtt.service'
import { Garden } from '../entities/garden.entity'
import { GardenMetric } from '../models/metric.model'

@Injectable()
export class GardenService {
    constructor(
        @InjectModel(Garden.name) private gardenModel: Model<Garden>,
        private mqttService: MqttService,
    ) {}

    private async getAgentId(agent: string): Promise<Agent> {
        // Try get agent
        const agentExists = this.mqttService.agents.filter((_agent) => {
            if (_agent.agent === agent) return _agent
        })
        if (agentExists.length > 0) return agentExists[0]
        // Get agent db
        const agentDb = await this.mqttService.findAgent(agent)
        if (agentDb) {
            const newAgent = {
                agent,
                _id: agentDb._id.toString(),
            }
            this.mqttService.insertAgentArray(newAgent)
            return newAgent
        }
        // Insert agent db
        const newAgentDb = await this.mqttService.createAgent(agent)
        const newAgent = {
            agent,
            _id: newAgentDb._id.toString(),
        }
        return newAgent
    }

    async insertMetrics(metric: GardenMetric) {
        const { agent, ...rest } = metric
        const agentId = await this.getAgentId(agent)
        const newMetric = new this.gardenModel({
            ...rest,
            agent: agentId._id,
            date: new Date(),
        })
        return await newMetric.save()
    }
}
