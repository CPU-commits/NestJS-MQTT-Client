import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as moment from 'moment'

import { Agent } from 'src/modules/mqtt/models/agent.model'
import { MqttService } from 'src/modules/mqtt/service/mqtt.service'
import { MetricsGateway } from 'src/modules/web/websockets/metrics.gateway'
import { Garden } from '../entities/garden.entity'
import { Plant } from '../entities/plant.entity'
import { GardenMetric } from '../models/metric.model'

@Injectable()
export class GardenService {
    constructor(
        @InjectModel(Garden.name) private gardenModel: Model<Garden>,
        @InjectModel(Plant.name) private plantModel: Model<Plant>,
        private mqttService: MqttService,
        private metricsGW: MetricsGateway,
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

    private sendMetrics(metrics: GardenMetric) {
        this.metricsGW.sendGardenMetrics(metrics)
    }

    async getMetrics(limit = 100, latest?: boolean, date?: string) {
        const query = this.gardenModel
            .find(
                date
                    ? {
                          date: {
                              $gte: date,
                          },
                      }
                    : null,
            )
            .limit(limit)
        if (latest) query.sort({ date: -1 })
        return (await query.exec()).sort((a, b) => {
            return moment(a.date).diff(moment(b.date), 'seconds')
        })
    }

    async getPlants() {
        return await this.plantModel
            .find()
            .populate('agent', { name: 1 })
            .exec()
    }

    async insertMetrics(metric: GardenMetric) {
        const { agent, ...rest } = metric
        const agentId = await this.getAgentId(agent)
        const newMetric = new this.gardenModel({
            ...rest,
            agent: agentId._id,
            date: new Date(),
        })
        // Send metrics Websocket
        this.sendMetrics(metric)
        // Save data DB
        return await newMetric.save()
    }
}
