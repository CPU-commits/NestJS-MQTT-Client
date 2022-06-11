import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Agent } from '../entities/agents.entity'

@Injectable()
export class MqttService {
    public readonly agents = []
    private readonly CLIENT_NEST_AGENT = 'Client-001-Client'

    constructor(@InjectModel(Agent.name) private agentModel: Model<Agent>) {
        this.createNestAgent()
    }

    private async createNestAgent() {
        const nestAgent = await this.findAgent(this.CLIENT_NEST_AGENT)
        if (!nestAgent) this.createAgent(this.CLIENT_NEST_AGENT)
    }

    private async findAgent(agent: string) {
        return await this.agentModel.findOne({
            name: agent,
        })
    }

    private async createAgent(agent: string) {
        const splitData = agent.split('-')
        const newAgent = new this.agentModel({
            name: agent,
            agent_type: splitData[2].toLowerCase(),
            agent_task: splitData[0].toLowerCase(),
        })
        return await newAgent.save()
    }

    async registerAgent(agent: string) {
        const agentData = await this.findAgent(agent)
        if (!this.agents.some((a) => a === agent)) {
            if (!agentData) {
                await this.createAgent(agent)
            }
            this.agents.push(agent)
        } else {
            agentData
                .update(
                    {
                        $set: {
                            connected: true,
                        },
                    },
                    { new: true },
                )
                .exec()
        }
    }
}
