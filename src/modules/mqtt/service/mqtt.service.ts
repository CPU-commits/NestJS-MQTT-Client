import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { MetricsGateway } from 'src/modules/web/websockets/metrics.gateway'
import { Agent } from '../entities/agents.entity'
import { Task } from '../entities/task.entity'
import { Agent as AgentModel } from '../models/agent.model'

@Injectable()
export class MqttService {
    public readonly agents: Array<AgentModel> = []
    private readonly CLIENT_NEST_AGENT = 'Client-001-Client'

    constructor(
        @InjectModel(Agent.name) private agentModel: Model<Agent>,
        @InjectModel(Task.name) private taskModel: Model<Task>,
        private metricsGW: MetricsGateway,
    ) {
        this.createNestAgent()
    }

    insertAgentArray(agent: AgentModel) {
        this.agents.push(agent)
    }

    private async createNestAgent() {
        const nestAgent = await this.findAgent(this.CLIENT_NEST_AGENT)
        if (!nestAgent) this.createAgent(this.CLIENT_NEST_AGENT)
    }

    private async getTask(task: string) {
        return await this.taskModel
            .findOne({
                name: task.toLowerCase(),
            })
            .exec()
    }

    async getAgentsByTask(task: string) {
        const taskId = await this.taskModel.findOne({
            name: task,
        })
        return await this.agentModel
            .find({
                agent_task: taskId._id.toString(),
            })
            .exec()
    }

    async getTasks() {
        const tasksDb = await this.taskModel.find().exec()
        const tasks = await Promise.all(
            tasksDb.map(async (task) => {
                const { name, description, date, task: taskName } = task
                const agents = await this.getAgentsByTask(task._id.toString())
                return {
                    name,
                    description,
                    date,
                    task: taskName,
                    agents,
                }
            }),
        )
        return tasks
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
            agent_task: await this.getTask(splitData[0]),
            last_connection: now,
            created: now,
            connected,
        })
        return await newAgent.save()
    }

    async registerAgent(agent: string) {
        const now = new Date()
        // Send agent status
        this.metricsGW.sendAgentStatus(agent, true, now)
        // Update / create agent
        let agentData = await this.findAgent(agent)
        if (!this.agents.some((a) => a.agent === agent)) {
            if (!agentData) agentData = await this.createAgent(agent)
            this.insertAgentArray({
                agent,
                _id: agentData._id.toString(),
            })
        }
        agentData
            .updateOne(
                {
                    $set: {
                        connected: true,
                        last_connection: now,
                    },
                },
                { new: true },
            )
            .exec()
    }

    async disconnectAgent(agent: string) {
        this.metricsGW.sendAgentStatus(agent, false)
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
