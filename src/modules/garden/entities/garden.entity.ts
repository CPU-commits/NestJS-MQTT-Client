import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { Agent } from 'src/modules/mqtt/entities/agents.entity'

@Schema({ versionKey: false })
export class Garden {
    @Prop({ type: Types.ObjectId, ref: Agent.name, required: true })
    agent: Types.ObjectId | Agent

    @Prop({ required: true, type: Number })
    temperature: number

    @Prop({ required: true, type: Boolean })
    rain: boolean

    @Prop({ required: true, type: Number })
    rh: number

    @Prop({ required: true, type: Boolean })
    day: boolean

    @Prop({ required: true, type: Date })
    date: string | Date
}

export const SchemaGarden = SchemaFactory.createForClass(Garden)
