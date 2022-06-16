import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { Agent } from 'src/modules/mqtt/entities/agents.entity'

@Schema()
export class Plant {
    @Prop({ required: true })
    plant: string

    @Prop({ required: true, ref: Agent.name, type: Types.ObjectId })
    agent: Types.ObjectId | Agent

    @Prop({ required: true })
    max_temperature: number

    @Prop({ required: true })
    min_temperature: number

    @Prop({ required: true })
    max_rh: number

    @Prop({ required: true, type: Date })
    date: string
}

export const SchemaPlant = SchemaFactory.createForClass(Plant)
