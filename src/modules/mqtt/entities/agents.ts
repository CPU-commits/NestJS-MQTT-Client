import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

export enum AgentType {
    DEVICE = 'device',
    CLIENT = 'client',
}

export enum AgentTask {
    GARDEN = 'garden',
    CLIENT = 'client',
}

@Entity()
export class Agent {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', nullable: false, unique: true, length: 255 })
    name: string

    @Column({ type: 'enum', enum: AgentType, nullable: false })
    agent_type: string

    @Column({ type: 'text' })
    description: string

    @Column({ type: 'enum', enum: AgentTask, nullable: false })
    agent_task: string

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created: Date

    @Column({ type: 'boolean', default: true })
    connected: boolean
}
