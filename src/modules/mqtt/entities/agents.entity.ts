import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'

export enum AgentType {
    DEVICE = 'device',
    CLIENT = 'client',
}

export enum AgentTask {
    GARDEN = 'garden',
    CLIENT = 'client',
}

@Schema()
export class Agent {
    @Prop({ unique: true, maxlength: 255, required: true })
    name: string

    @Prop({ enum: [AgentType.CLIENT, AgentType.DEVICE] })
    agent_type: string

    @Prop({ required: false })
    description: string

    @Prop({ enum: [AgentTask.CLIENT, AgentTask.GARDEN] })
    agent_task: string

    @Prop({ type: Date, required: true })
    created: string | Date

    @Prop({ type: Date, required: true })
    last_connection: string | Date

    @Prop({ required: true, default: true, type: Boolean })
    connected: boolean
}

export const SchemaAgent = SchemaFactory.createForClass(Agent)
