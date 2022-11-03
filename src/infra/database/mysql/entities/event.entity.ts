import { Entity, Column, PrimaryGeneratedColumn, Index } from "typeorm"
import { EventModel } from "../../../../domain/dto/event-model";

@Entity({ name: 'events'})
export class Event implements EventModel {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    eventName: string
    
    @Index()
    @Column()
    happenedAt: Date;

    @Column({ type: 'json' })
    data: object | object[]
}