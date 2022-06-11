import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Agent } from '../entities/agents.entity'
import { Agent as AgentModel } from '../models/agent.model'

@Injectable()
export class MqttService {
    public readonly agents: Array<AgentModel> = []
    private readonly CLIENT_NEST_AGENT = 'Client-001-Client'

    constructor(@InjectModel(Agent.name) private agentModel: Model<Agent>) {
        this.createNestAgent()
    }

    insertAgentArray(agent: AgentModel) {
        this.agents.push(agent)
    }

    private async createNestAgent() {
        const nestAgent = await this.findAgent(this.CLIENT_NEST_AGENT)
        if (!nestAgent) this.createAgent(this.CLIENT_NEST_AGENT)
    }

    async findAgent(agent: string) {
        return await this.agentModel.findOne({
            name: agent,
        })
    }

    async createAgent(agent: string, connected = true) {
        const splitData = agent.split('-')
        const now = new Date()
        const newAgent = new this.agentModel({
            name: agent,
            agent_type: splitData[2].toLowerCase(),
            agent_task: splitData[0].toLowerCase(),
            last_connection: now,
            created: now,
            connected,
        })
        return await newAgent.save()
    }

    async registerAgent(agent: string) {
        let agentData = await this.findAgent(agent)
        if (!this.agents.some((a) => a.agent === agent)) {
            if (!agentData) agentData = await this.createAgent(agent)
            this.insertAgentArray({
                agent,
                _id: agentData._id.toString(),
            })
        } else {
            agentData
                .updateOne(
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

    async disconnectAgent(agent: string) {
        const agentData = await this.findAgent(agent)
        if (!agentData) {
            this.createAgent(agent, false)
        } else {
            return await agentData
                .updateOne(
                    {
                        $set: {
                            connected: false,
                            last_connection: new Date(),
                        },
                    },
                    { new: true },
                )
                .exec()
        }
    }
}
