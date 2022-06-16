import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema()
export class Task {
    @Prop({ required: true, unique: true, index: true })
    name: string

    @Prop({ required: true })
    description: string

    @Prop({ required: true })
    task: string

    @Prop({ required: true, type: Date })
    date: Date | string
}

export const SchemaTask = SchemaFactory.createForClass(Task)
