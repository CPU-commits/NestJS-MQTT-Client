import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as moment from 'moment'
import { Plant as PlantDTO } from '../models/plant.model'
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

    async getMetricsAgent(
        agentId: string,
        limit?: number,
        latest?: boolean,
        date?: string,
    ) {
        const filter: any = {
            agent: agentId,
        }
        if (date)
            filter.date = {
                $gte: date,
            }
        const query = this.gardenModel.find(filter, { _id: 0 }).limit(limit)
        if (latest) query.sort({ date: -1 })
        return (await query.exec()).sort((a, b) => {
            return moment(a.date).diff(moment(b.date), 'seconds')
        })
    }

    async getMetrics(limit = 100, latest?: boolean, date?: string) {
        const agents = await this.mqttService.getDeviceAgents('garden')
        const metrics = await Promise.all(
            agents.map(async (agent) => {
                return {
                    metrics: await this.getMetricsAgent(
                        agent._id.toString(),
                        limit,
                        latest,
                        date,
                    ),
                    agent: agent.name,
                }
            }),
        )
        return metrics
    }

    async getPlants() {
        return await this.plantModel
            .find()
            .populate('agent', { name: 1 })
            .exec()
    }

    async registerPlants(plants: Array<PlantDTO>) {
        const newPlants = await Promise.all(
            plants.map(async (plant) => {
                const { agent, ...rest } = plant
                const agentDB = await this.mqttService.findAgent(agent)

                const exists = await this.plantModel
                    .exists({
                        plant: plant.plant,
                        agent: agentDB._id,
                    })
                    .exec()
                return {
                    exists,
                    model: new this.plantModel({
                        ...rest,
                        agent: agentDB._id,
                        date: new Date(),
                    }),
                }
            }),
        )

        await this.plantModel.insertMany(
            newPlants
                .filter((plant) => !plant.exists)
                .map((plant) => plant.model),
        )
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
