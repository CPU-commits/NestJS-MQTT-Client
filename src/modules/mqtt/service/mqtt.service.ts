import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Agent } from '../entities/agents'

@Injectable()
export class MqttService {
    public readonly agents = []
    private readonly CLIENT_NEST_AGENT = 'Client-001-Client'

    constructor(
        @InjectRepository(Agent) private agentRepository: Repository<Agent>,
    ) {
        this.createNestAgent()
    }

    private async createNestAgent() {
        const nestAgent = await this.findAgent(this.CLIENT_NEST_AGENT)
        if (!nestAgent) this.createAgent(this.CLIENT_NEST_AGENT)
    }

    private async findAgent(agent: string) {
        return await this.agentRepository.findOneBy({
            name: agent,
        })
    }

    private async createAgent(agent: string) {
        const splitData = agent.split('-')
        const newAgent = this.agentRepository.create({
            name: agent,
            agent_type: splitData[2].toLowerCase(),
            agent_task: splitData[0],
        })
        return await this.agentRepository.save(newAgent)
    }

    async registerAgent(agent: string) {
        const agentData = await this.findAgent(agent)
        if (!this.agents.some((a) => a === agent)) {
            if (!agentData) {
                await this.createAgent(agent)
            }
            this.agents.push(agent)
        } else {
            this.agentRepository.merge(agentData, {
                connected: true,
            })
            await this.agentRepository.save(agentData)
        }
    }
}
