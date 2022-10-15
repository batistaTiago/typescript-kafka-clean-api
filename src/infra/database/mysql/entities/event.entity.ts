import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
import { Event as DomainEvent } from '../../../../domain/entities/event';

@Entity()
export class Event implements DomainEvent {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    eventName: string

    @Column()
    happenedAt: Date;
}